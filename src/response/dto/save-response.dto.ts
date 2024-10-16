import { IsNotEmpty, IsArray } from 'class-validator';

export class SaveResponsesDto {
  @IsNotEmpty()
  userId: number;

  @IsArray()
  responses: { questionId: number; answer: string }[];
}