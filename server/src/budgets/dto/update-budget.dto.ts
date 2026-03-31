import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { BudgetPeriod } from './create-budget.dto';

export class UpdateBudgetDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsPositive()
  limitAmount?: number;

  @IsOptional()
  @IsEnum(BudgetPeriod)
  period?: BudgetPeriod;
}