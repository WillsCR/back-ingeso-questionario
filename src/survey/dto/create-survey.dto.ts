import { IsNotEmpty, IsArray } from 'class-validator';

export class CreateSurveyDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsArray()
  questions: { text: string; responses?: { userId: number; answer: string }[] }[];
}