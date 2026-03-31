import { IsEnum, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export enum AccountTypeInput {
  CASH = 'cash',
  BANK = 'bank',
  CARD = 'card',
}

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsEnum(AccountTypeInput)
  type!: AccountTypeInput;

  @IsPositive()
  balance!: number;
}
