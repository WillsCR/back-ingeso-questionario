import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
export class CreateResponseDto {
    @IsNotEmpty()
    userId: number;
  
    @IsString()
    @IsNotEmpty()
    answer: string;
  }
  
