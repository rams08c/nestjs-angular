import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryType, Prisma } from '@prisma/client';
import { BudgetErrors } from '../common/error.util';
import { PrismaService } from '../prisma/prisma.service';
import { BudgetPeriod, CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

type BudgetResponse = {
  id: string;
  categoryId: string;
  limitAmount: number;
  period: string;
  usedAmount: number;
  remainingAmount: number;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBudgetDto): Promise<BudgetResponse> {
    await this.ensureExpenseCategory(userId, dto.categoryId);

    const created = await this.prisma.budget.create({
      data: {
        ownerUserId: userId,
        categoryId: dto.categoryId,
        limitAmount: new Prisma.Decimal(dto.limitAmount),
        period: dto.period,
      },
    });

    return this.toResponse(userId, created);
  }

  async findAll(userId: string): Promise<BudgetResponse[]> {
    const budgets = await this.prisma.budget.findMany({
      where: { ownerUserId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(budgets.map((budget) => this.toResponse(userId, budget)));
  }

  async update(userId: string, id: string, dto: UpdateBudgetDto): Promise<BudgetResponse> {
    const existing = await this.prisma.budget.findUnique({ where: { id } });
    this.assertOwnedBudget(userId, existing);

    const nextCategoryId = dto.categoryId ?? existing.categoryId;
    await this.ensureExpenseCategory(userId, nextCategoryId);

    const updated = await this.prisma.budget.update({
      where: { id },
      data: {
        categoryId: dto.categoryId,
        limitAmount:
          typeof dto.limitAmount === 'number'
            ? new Prisma.Decimal(dto.limitAmount)
            : undefined,
        period: dto.period,
      },
    });

    return this.toResponse(userId, updated);
  }

  async remove(userId: string, id: string): Promise<void> {
    const existing = await this.prisma.budget.findUnique({ where: { id } });
    this.assertOwnedBudget(userId, existing);
    await this.prisma.budget.delete({ where: { id } });
  }

  private async ensureExpenseCategory(userId: string, categoryId: string): Promise<void> {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        OR: [{ ownerUserId: userId }, { isSystem: true }],
      },
      select: { type: true },
    });

    if (!category || category.type !== CategoryType.EXPENSE) {
      throw new BadRequestException(BudgetErrors.BUDGET_CATEGORY_INVALID());
    }
  }

  private assertOwnedBudget(
    userId: string,
    budget: {
      ownerUserId: string;
      categoryId: string;
      limitAmount: Prisma.Decimal;
      period: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
    } | null,
  ): asserts budget is {
    ownerUserId: string;
    categoryId: string;
    limitAmount: Prisma.Decimal;
    period: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    if (!budget) {
      throw new NotFoundException(BudgetErrors.BUDGET_NOT_FOUND());
    }

    if (budget.ownerUserId !== userId) {
      throw new ForbiddenException(BudgetErrors.BUDGET_ACCESS_FORBIDDEN());
    }
  }

  private async toResponse(
    userId: string,
    budget: {
      id: string;
      categoryId: string;
      limitAmount: Prisma.Decimal;
      period: string;
      createdAt: Date;
      updatedAt: Date;
    },
  ): Promise<BudgetResponse> {
    const usedAmount = await this.computeUsedAmount(userId, budget.categoryId, budget.period);
    const limitAmount = Number(budget.limitAmount);
    const remainingAmount = limitAmount - usedAmount;
    const progressPercent = limitAmount > 0
      ? Number(((usedAmount / limitAmount) * 100).toFixed(2))
      : 0;

    return {
      id: budget.id,
      categoryId: budget.categoryId,
      limitAmount,
      period: budget.period,
      usedAmount,
      remainingAmount,
      progressPercent,
      createdAt: budget.createdAt.toISOString(),
      updatedAt: budget.updatedAt.toISOString(),
    };
  }

  private async computeUsedAmount(
    userId: string,
    categoryId: string,
    period: string,
  ): Promise<number> {
    if (period !== BudgetPeriod.MONTHLY) {
      return 0;
    }

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);

    const result = await this.prisma.transaction.aggregate({
      where: {
        ownerUserId: userId,
        categoryId,
        transactionDate: {
          gte: start,
          lt: end,
        },
      },
      _sum: { amount: true },
    });

    return Number(result._sum.amount ?? 0);
  }
}