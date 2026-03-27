import { IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { CategoryInputType } from './create-category.dto';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsEnum(CategoryInputType)
  type?: CategoryInputType;

  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;
}
