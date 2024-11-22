import { 
  IsNumber, 
  IsNotEmpty, 
  IsArray, 
  ValidateNested, 
  IsString 
} from 'class-validator';
import { Type } from 'class-transformer';

class ResponseItemDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El itemId no puede estar vacío' })
  itemId: number;

  @IsString()
  @IsNotEmpty({ message: 'La respuesta no puede estar vacía' })
  answer: string;
}

export class SaveResponsesDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El userId es obligatorio' })
  userId: number;

  @IsArray({ message: 'Las respuestas deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => ResponseItemDto) 
  responses: ResponseItemDto[];
  
}