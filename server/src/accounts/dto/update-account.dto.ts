import { IsEnum, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { AccountTypeInput } from './create-account.dto';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEnum(AccountTypeInput)
  type?: AccountTypeInput;

  @IsOptional()
  @IsPositive()
  balance?: number;
}
