import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category, CategoryType } from '@prisma/client';
import { CategoryErrors } from '../common/error.util';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryInputType, CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

type CategoryResponse = {
  id: string;
  name: string;
  type: CategoryInputType;
  isSystem: boolean;
  ownerUserId: string | null;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCategoryDto): Promise<CategoryResponse> {
    if (dto.isSystem === true) {
      throw new BadRequestException(CategoryErrors.SYSTEM_CATEGORY_CREATION_FORBIDDEN());
    }

    const category = await this.prisma.category.create({
      data: {
        name: dto.name.trim(),
        type: this.toDbType(dto.type),
        isSystem: false,
        ownerUserId: userId,
      },
    });

    return this.toResponse(category);
  }

  async findAll(userId: string): Promise<CategoryResponse[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        OR: [{ isSystem: true }, { ownerUserId: userId }],
      },
      orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
    });

    return categories.map((category) => this.toResponse(category));
  }

  async findOne(userId: string, id: string): Promise<CategoryResponse> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    this.assertReadable(userId, category);
    return this.toResponse(category);
  }

  async update(userId: string, id: string, dto: UpdateCategoryDto): Promise<CategoryResponse> {
    if (typeof dto.isSystem === 'boolean') {
      throw new BadRequestException(CategoryErrors.SYSTEM_FLAG_MUTATION_FORBIDDEN());
    }

    const existing = await this.prisma.category.findUnique({ where: { id } });
    this.assertMutable(userId, existing);

    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        type: dto.type ? this.toDbType(dto.type) : undefined,
      },
    });

    return this.toResponse(updated);
  }

  async remove(userId: string, id: string): Promise<void> {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    this.assertMutable(userId, existing);
    await this.prisma.category.delete({ where: { id } });
  }

  private assertReadable(userId: string, category: Category | null): asserts category is Category {
    if (!category) {
      throw new NotFoundException(CategoryErrors.CATEGORY_NOT_FOUND());
    }

    if (!category.isSystem && category.ownerUserId !== userId) {
      throw new NotFoundException(CategoryErrors.CATEGORY_NOT_FOUND());
    }
  }

  private assertMutable(userId: string, category: Category | null): asserts category is Category {
    if (!category) {
      throw new NotFoundException(CategoryErrors.CATEGORY_NOT_FOUND());
    }

    if (category.isSystem) {
      throw new ForbiddenException(CategoryErrors.SYSTEM_CATEGORY_IMMUTABLE());
    }

    if (category.ownerUserId !== userId) {
      throw new ForbiddenException(CategoryErrors.CATEGORY_ACCESS_FORBIDDEN());
    }
  }

  private toDbType(type: CategoryInputType): CategoryType {
    return type === CategoryInputType.EXPENSE ? CategoryType.EXPENSE : CategoryType.INCOME;
  }

  private toResponse(category: Category): CategoryResponse {
    return {
      id: category.id,
      name: category.name,
      type: category.type === CategoryType.EXPENSE ? CategoryInputType.EXPENSE : CategoryInputType.INCOME,
      isSystem: category.isSystem,
      ownerUserId: category.ownerUserId,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }
}
