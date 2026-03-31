import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export enum TransactionInputType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export class CreateTransactionDto {
  @IsPositive()
  amount!: number;

  @IsEnum(TransactionInputType)
  type!: TransactionInputType;

  @IsString()
  categoryId!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  groupId?: string;

  @IsOptional()
  @IsString()
  accountId?: string;
}
