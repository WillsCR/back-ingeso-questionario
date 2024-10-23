import { IsNumber, IsNotEmpty, IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class ResponseItemDto {
  @IsNumber()
  @IsNotEmpty()
  itemId: number; 
  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class SaveResponsesDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponseItemDto) 
  responses: ResponseItemDto[]; 
}