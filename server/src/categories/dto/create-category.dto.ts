import { IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum CategoryInputType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export class CreateCategoryDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsEnum(CategoryInputType)
  type!: CategoryInputType;

  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;
}
