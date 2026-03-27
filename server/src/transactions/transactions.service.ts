import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionErrors } from '../common/error.util';
import {
  CreateTransactionDto,
  TransactionInputType,
} from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

type TransactionWithCategory = Prisma.TransactionGetPayload<{
  include: { category: { select: { type: true } } };
}>;

type TransactionResponse = {
  id: string;
  amount: number;
  type: TransactionInputType;
  categoryId: string;
  description: string | null;
  date: string;
  userId: string;
  groupId: string | null;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTransactionDto): Promise<TransactionResponse> {
    const category = await this.findOwnedCategory(userId, dto.categoryId);
    this.assertTypeMatchesCategory(dto.type, category.type);

    const created = await this.prisma.transaction.create({
      data: {
        ownerUserId: userId,
        categoryId: dto.categoryId,
        groupId: dto.groupId,
        amount: new Prisma.Decimal(dto.amount),
        currency: 'USD',
        note: dto.description,
        transactionDate: new Date(dto.date),
      },
      include: {
        category: {
          select: { type: true },
        },
      },
    });

    return this.toResponse(created);
  }

  async findAll(userId: string): Promise<TransactionResponse[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { ownerUserId: userId },
      orderBy: { transactionDate: 'desc' },
      include: {
        category: {
          select: { type: true },
        },
      },
    });

    return transactions.map((item) => this.toResponse(item));
  }

  async findOne(userId: string, id: string): Promise<TransactionResponse> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        category: {
          select: { type: true },
        },
      },
    });

    this.assertOwnedTransaction(userId, transaction);
    return this.toResponse(transaction);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionResponse> {
    const existing = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        category: {
          select: { type: true },
        },
      },
    });

    this.assertOwnedTransaction(userId, existing);

    const nextCategoryId = dto.categoryId ?? existing.categoryId;
    const category = await this.findOwnedCategory(userId, nextCategoryId);

    if (dto.type) {
      this.assertTypeMatchesCategory(dto.type, category.type);
    }

    const updated = await this.prisma.transaction.update({
      where: { id },
      data: {
        categoryId: dto.categoryId,
        groupId: dto.groupId,
        amount:
          typeof dto.amount === 'number' ? new Prisma.Decimal(dto.amount) : undefined,
        note: dto.description,
        transactionDate: dto.date ? new Date(dto.date) : undefined,
      },
      include: {
        category: {
          select: { type: true },
        },
      },
    });

    return this.toResponse(updated);
  }

  async remove(userId: string, id: string): Promise<void> {
    const existing = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        category: {
          select: { type: true },
        },
      },
    });

    this.assertOwnedTransaction(userId, existing);
    await this.prisma.transaction.delete({ where: { id } });
  }

  private async findOwnedCategory(userId: string, categoryId: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        OR: [{ ownerUserId: userId }, { isSystem: true }],
      },
      select: { type: true },
    });

    if (!category) {
      throw new BadRequestException(TransactionErrors.CATEGORY_NOT_FOUND());
    }

    return category;
  }

  private assertTypeMatchesCategory(type: TransactionInputType, categoryType: CategoryType) {
    const normalized = categoryType === CategoryType.EXPENSE ? 'expense' : 'income';
    if (type !== normalized) {
      throw new BadRequestException(TransactionErrors.TYPE_CATEGORY_MISMATCH());
    }
  }

  private assertOwnedTransaction(
    userId: string,
    transaction: TransactionWithCategory | null,
  ): asserts transaction is TransactionWithCategory {
    if (!transaction) {
      throw new NotFoundException(TransactionErrors.TRANSACTION_NOT_FOUND());
    }

    if (transaction.ownerUserId !== userId) {
      throw new ForbiddenException(TransactionErrors.INVALID_TRANSACTION_ACCESS());
    }
  }

  private toResponse(transaction: TransactionWithCategory): TransactionResponse {
    return {
      id: transaction.id,
      amount: Number(transaction.amount),
      type:
        transaction.category.type === CategoryType.EXPENSE
          ? TransactionInputType.EXPENSE
          : TransactionInputType.INCOME,
      categoryId: transaction.categoryId,
      description: transaction.note,
      date: transaction.transactionDate.toISOString(),
      userId: transaction.ownerUserId,
      groupId: transaction.groupId,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  }
}
