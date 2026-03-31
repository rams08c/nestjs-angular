import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GoalErrors } from '../common/error.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

type GoalResponse = {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string;
  remainingAmount: number;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateGoalDto): Promise<GoalResponse> {
    this.ensureSavedWithinTarget(dto.savedAmount, dto.targetAmount);

    const created = await this.prisma.goal.create({
      data: {
        ownerUserId: userId,
        name: dto.name.trim(),
        targetAmount: new Prisma.Decimal(dto.targetAmount),
        savedAmount: new Prisma.Decimal(dto.savedAmount),
        targetDate: new Date(dto.targetDate),
      },
    });

    return this.toResponse(created);
  }

  async findAll(userId: string): Promise<GoalResponse[]> {
    const goals = await this.prisma.goal.findMany({
      where: { ownerUserId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return goals.map((goal) => this.toResponse(goal));
  }

  async update(userId: string, id: string, dto: UpdateGoalDto): Promise<GoalResponse> {
    const existing = await this.prisma.goal.findUnique({ where: { id } });
    this.assertOwnedGoal(userId, existing);

    const nextTarget = dto.targetAmount ?? Number(existing.targetAmount);
    const nextSaved = dto.savedAmount ?? Number(existing.savedAmount);
    this.ensureSavedWithinTarget(nextSaved, nextTarget);

    const updated = await this.prisma.goal.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        targetAmount:
          typeof dto.targetAmount === 'number'
            ? new Prisma.Decimal(dto.targetAmount)
            : undefined,
        savedAmount:
          typeof dto.savedAmount === 'number'
            ? new Prisma.Decimal(dto.savedAmount)
            : undefined,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
      },
    });

    return this.toResponse(updated);
  }

  async remove(userId: string, id: string): Promise<void> {
    const existing = await this.prisma.goal.findUnique({ where: { id } });
    this.assertOwnedGoal(userId, existing);
    await this.prisma.goal.delete({ where: { id } });
  }

  private assertOwnedGoal(
    userId: string,
    goal: {
      ownerUserId: string;
      targetAmount: Prisma.Decimal;
      savedAmount: Prisma.Decimal;
      id: string;
      name: string;
      targetDate: Date;
      createdAt: Date;
      updatedAt: Date;
    } | null,
  ): asserts goal is {
    ownerUserId: string;
    targetAmount: Prisma.Decimal;
    savedAmount: Prisma.Decimal;
    id: string;
    name: string;
    targetDate: Date;
    createdAt: Date;
    updatedAt: Date;
  } {
    if (!goal) {
      throw new NotFoundException(GoalErrors.GOAL_NOT_FOUND());
    }

    if (goal.ownerUserId !== userId) {
      throw new ForbiddenException(GoalErrors.GOAL_ACCESS_FORBIDDEN());
    }
  }

  private ensureSavedWithinTarget(savedAmount: number, targetAmount: number): void {
    if (savedAmount > targetAmount) {
      throw new BadRequestException(GoalErrors.GOAL_SAVED_EXCEEDS_TARGET());
    }
  }

  private toResponse(goal: {
    id: string;
    name: string;
    targetAmount: Prisma.Decimal;
    savedAmount: Prisma.Decimal;
    targetDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }): GoalResponse {
    const targetAmount = Number(goal.targetAmount);
    const savedAmount = Number(goal.savedAmount);
    const remainingAmount = targetAmount - savedAmount;
    const progressPercent = targetAmount > 0
      ? Number(((savedAmount / targetAmount) * 100).toFixed(2))
      : 0;

    return {
      id: goal.id,
      name: goal.name,
      targetAmount,
      savedAmount,
      targetDate: goal.targetDate.toISOString(),
      remainingAmount,
      progressPercent,
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString(),
    };
  }
}