import { IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class CreateItemDto {
  @IsNotEmpty()
  text: string;

 
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateResponseDto)
  // @IsOptional()
  // responses?: CreateResponseDto[];
}

class CreateDimensionDto {
  @IsNotEmpty()
  name: string;

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

  @IsNotEmpty()
  subjectName: string;

  @IsNotEmpty()
  professorName: string;

  @IsOptional()
  studentName?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDimensionDto)
  dimensions: CreateDimensionDto[];
}