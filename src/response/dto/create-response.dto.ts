import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateResponseDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  itemId: number; 

  @IsString()
  @IsNotEmpty()
  answer: string;
}