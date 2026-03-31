import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateGoalDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  targetAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  savedAmount?: number;

  @IsOptional()
  @IsDateString()
  targetDate?: string;
}