import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateResponseDto } from 'src/response/dto/create-response.dto';
export class CreateSurveyDto {

    @IsNumber()
    @IsNotEmpty()
    surveyId: number;

    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateResponseDto)
    responses: CreateResponseDto[];
  }
