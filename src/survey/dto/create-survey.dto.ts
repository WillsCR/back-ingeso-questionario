import { IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

// DTO para los ítems dentro de una dimensión
class CreateItemDto {
  @IsNotEmpty()
  text: string;

  // Otras propiedades relacionadas con respuestas pueden ser agregadas aquí
}

// DTO para las dimensiones de la encuesta
class CreateDimensionDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  items: CreateItemDto[]; // Lista de ítems que pertenecen a esta dimensión
}

// DTO principal para la encuesta
export class CreateSurveyDto {
  @IsNotEmpty()
  title: string; // Título de la encuesta

  @IsNotEmpty()
  description: string; // Descripción de la encuesta

  @IsNotEmpty()
  subjectName: string; // Nombre de la asignatura

  @IsNotEmpty()
  professorName: string; // Nombre del profesor

  @IsOptional()
  studentName?: string; // Nombre del estudiante (opcional)

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDimensionDto)
  dimensions: CreateDimensionDto[]; // Lista de dimensiones de la encuesta
}
