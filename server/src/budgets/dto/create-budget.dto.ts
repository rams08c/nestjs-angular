import { IsEnum, IsPositive, IsString } from 'class-validator';

export enum BudgetPeriod {
  MONTHLY = 'monthly',
}

export class CreateBudgetDto {
  @IsString()
  categoryId!: string;

  @IsPositive()
  limitAmount!: number;

  @IsEnum(BudgetPeriod)
  period!: BudgetPeriod;
}