import { IsDateString, IsNumber, IsString, Min } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  name!: string;

  @IsNumber()
  @Min(0.01)
  targetAmount!: number;

  @IsNumber()
  @Min(0)
  savedAmount!: number;

  @IsDateString()
  targetDate!: string;
}