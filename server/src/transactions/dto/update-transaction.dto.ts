import {
	IsDateString,
	IsEnum,
	IsOptional,
	IsPositive,
	IsString,
} from 'class-validator';
import { TransactionInputType } from './create-transaction.dto';

export class UpdateTransactionDto {
	@IsOptional()
	@IsPositive()
	amount?: number;

	@IsOptional()
	@IsEnum(TransactionInputType)
	type?: TransactionInputType;

	@IsOptional()
	@IsString()
	categoryId?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsDateString()
	date?: string;

	@IsOptional()
	@IsString()
	groupId?: string;
}
