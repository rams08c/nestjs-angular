import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionInputType } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

const mockCategory = { type: CategoryType.EXPENSE };

const makeTransaction = (overrides = {}) => ({
  id: 'tx-1',
  ownerUserId: 'user-1',
  categoryId: 'cat-1',
  groupId: null,
  accountId: null,
  amount: { toNumber: () => 50 } as any,
  note: 'Lunch',
  transactionDate: new Date('2026-03-01'),
  createdAt: new Date('2026-03-01'),
  updatedAt: new Date('2026-03-01'),
  category: mockCategory,
  ...overrides,
});

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            category: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get(TransactionsService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
  });

  // ---------- findAll ----------

  describe('findAll', () => {
    it('returns paginated transactions with defaults (page=1, limit=10)', async () => {
      const tx = makeTransaction();
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([tx]);
      (prisma.transaction.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findAll('user-1', {});

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('tx-1');
    });

    it('applies page and limit from query', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.transaction.count as jest.Mock).mockResolvedValue(25);

      const result = await service.findAll('user-1', { page: 3, limit: 5 });

      expect(result.page).toBe(3);
      expect(result.limit).toBe(5);
      expect(result.totalPages).toBe(5);
      expect(prisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 5 }),
      );
    });

    it('filters by search term (note contains)', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.transaction.count as jest.Mock).mockResolvedValue(0);

      await service.findAll('user-1', { search: 'lunch' });

      expect(prisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            note: { contains: 'lunch', mode: 'insensitive' },
          }),
        }),
      );
    });

    it('filters by type=expense maps to CategoryType.EXPENSE', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.transaction.count as jest.Mock).mockResolvedValue(0);

      await service.findAll('user-1', { type: TransactionInputType.EXPENSE });

      expect(prisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: { type: CategoryType.EXPENSE },
          }),
        }),
      );
    });

    it('filters by type=income maps to CategoryType.INCOME', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.transaction.count as jest.Mock).mockResolvedValue(0);

      await service.findAll('user-1', { type: TransactionInputType.INCOME });

      expect(prisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: { type: CategoryType.INCOME },
          }),
        }),
      );
    });

    it('filters by categoryId', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.transaction.count as jest.Mock).mockResolvedValue(0);

      await service.findAll('user-1', { categoryId: 'cat-42' });

      expect(prisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ categoryId: 'cat-42' }),
        }),
      );
    });

    it('filters by dateFrom and dateTo', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.transaction.count as jest.Mock).mockResolvedValue(0);

      await service.findAll('user-1', {
        dateFrom: '2026-01-01',
        dateTo: '2026-03-31',
      });

      expect(prisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            transactionDate: {
              gte: new Date('2026-01-01'),
              lte: new Date('2026-03-31'),
            },
          }),
        }),
      );
    });

    it('calculates totalPages correctly when remainder exists', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.transaction.count as jest.Mock).mockResolvedValue(11);

      const result = await service.findAll('user-1', { limit: 10 });

      expect(result.totalPages).toBe(2);
    });

    it('returns totalPages=0 when total is 0', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.transaction.count as jest.Mock).mockResolvedValue(0);

      const result = await service.findAll('user-1', {});

      expect(result.totalPages).toBe(0);
    });
  });

  // ---------- create ----------

  describe('create', () => {
    it('creates a transaction and returns mapped response', async () => {
      (prisma.category.findFirst as jest.Mock).mockResolvedValue(mockCategory);
      (prisma.transaction.create as jest.Mock).mockResolvedValue(makeTransaction());

      const result = await service.create('user-1', {
        amount: 50,
        type: TransactionInputType.EXPENSE,
        categoryId: 'cat-1',
        date: '2026-03-01',
      });

      expect(result.id).toBe('tx-1');
      expect(result.type).toBe(TransactionInputType.EXPENSE);
    });

    it('throws 400 when category is not found', async () => {
      (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create('user-1', {
          amount: 50,
          type: TransactionInputType.EXPENSE,
          categoryId: 'cat-missing',
          date: '2026-03-01',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws 400 on type/category mismatch', async () => {
      (prisma.category.findFirst as jest.Mock).mockResolvedValue({ type: CategoryType.INCOME });

      await expect(
        service.create('user-1', {
          amount: 50,
          type: TransactionInputType.EXPENSE,
          categoryId: 'cat-1',
          date: '2026-03-01',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ---------- findOne ----------

  describe('findOne', () => {
    it('returns transaction for the owner', async () => {
      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(makeTransaction());

      const result = await service.findOne('user-1', 'tx-1');

      expect(result.id).toBe('tx-1');
    });

    it('throws 404 when transaction not found', async () => {
      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('user-1', 'tx-missing')).rejects.toThrow(NotFoundException);
    });

    it('throws 403 when accessed by another user', async () => {
      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(
        makeTransaction({ ownerUserId: 'user-2' }),
      );

      await expect(service.findOne('user-1', 'tx-1')).rejects.toThrow(ForbiddenException);
    });
  });

  // ---------- remove ----------

  describe('remove', () => {
    it('deletes the transaction', async () => {
      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(makeTransaction());
      (prisma.transaction.delete as jest.Mock).mockResolvedValue({});

      await expect(service.remove('user-1', 'tx-1')).resolves.toBeUndefined();
      expect(prisma.transaction.delete).toHaveBeenCalledWith({ where: { id: 'tx-1' } });
    });

    it('throws 403 when trying to delete another user transaction', async () => {
      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(
        makeTransaction({ ownerUserId: 'user-2' }),
      );

      await expect(service.remove('user-1', 'tx-1')).rejects.toThrow(ForbiddenException);
    });
  });
});
