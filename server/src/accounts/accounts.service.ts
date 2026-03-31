import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AccountErrors } from '../common/error.util';
import { AccountTypeInput, CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

const ACCOUNT_TYPE_MAP: Record<AccountTypeInput, AccountType> = {
  [AccountTypeInput.CASH]: AccountType.CASH,
  [AccountTypeInput.BANK]: AccountType.BANK,
  [AccountTypeInput.CARD]: AccountType.CARD,
};

export interface AccountResponse {
  id: string;
  name: string;
  type: AccountTypeInput;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateAccountDto): Promise<AccountResponse> {
    try {
      const account = await this.prisma.account.create({
        data: {
          ownerUserId: userId,
          name: dto.name.trim(),
          type: ACCOUNT_TYPE_MAP[dto.type],
          balance: new Prisma.Decimal(dto.balance),
        },
      });
      return this.toResponse(account);
    } catch (err: unknown) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException(AccountErrors.ACCOUNT_NAME_CONFLICT());
      }
      throw err;
    }
  }

  async findAll(userId: string): Promise<AccountResponse[]> {
    const accounts = await this.prisma.account.findMany({
      where: { ownerUserId: userId },
      orderBy: { createdAt: 'asc' },
    });
    return accounts.map((a) => this.toResponse(a));
  }

  async update(userId: string, id: string, dto: UpdateAccountDto): Promise<AccountResponse> {
    await this.assertOwnership(userId, id);

    try {
      const updated = await this.prisma.account.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name.trim() }),
          ...(dto.type !== undefined && { type: ACCOUNT_TYPE_MAP[dto.type] }),
          ...(dto.balance !== undefined && { balance: new Prisma.Decimal(dto.balance) }),
        },
      });
      return this.toResponse(updated);
    } catch (err: unknown) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException(AccountErrors.ACCOUNT_NAME_CONFLICT());
      }
      throw err;
    }
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.assertOwnership(userId, id);

    const txCount = await this.prisma.transaction.count({
      where: { accountId: id },
    });

    if (txCount > 0) {
      throw new ForbiddenException(AccountErrors.ACCOUNT_HAS_TRANSACTIONS());
    }

    await this.prisma.account.delete({ where: { id } });
  }

  private async assertOwnership(userId: string, id: string) {
    const account = await this.prisma.account.findUnique({ where: { id } });
    if (!account) throw new NotFoundException(AccountErrors.ACCOUNT_NOT_FOUND());
    if (account.ownerUserId !== userId) {
      throw new ForbiddenException(AccountErrors.ACCOUNT_ACCESS_FORBIDDEN());
    }
    return account;
  }

  private toResponse(account: {
    id: string;
    name: string;
    type: AccountType;
    balance: Prisma.Decimal;
    createdAt: Date;
    updatedAt: Date;
  }): AccountResponse {
    const typeReverseMap: Record<AccountType, AccountTypeInput> = {
      CASH: AccountTypeInput.CASH,
      BANK: AccountTypeInput.BANK,
      CARD: AccountTypeInput.CARD,
    };
    return {
      id: account.id,
      name: account.name,
      type: typeReverseMap[account.type],
      balance: account.balance.toNumber(),
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };
  }
}
