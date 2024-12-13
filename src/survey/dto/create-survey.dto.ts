import { IsNotEmpty, IsArray, ValidateNested, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { DimensionType } from '../entities/dimension.entity';  

class CreateItemDto {
  @IsNotEmpty()
  text: string;
}

class CreateDimensionDto {
  @IsNotEmpty()
  name: string;

  @IsEnum(DimensionType, { message: 'Tipo debe ser Agreedlevel, freetext o Identidad' })
  tipo: DimensionType;  

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  items: CreateItemDto[];
}

export class CreateSurveyDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty({ message: 'El campo "subject" es obligatorio' })
  subject: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDimensionDto)
  dimensions: CreateDimensionDto[];
}