import { IsNotEmpty, IsDateString, IsString, IsInt, isNotEmpty, IsNumber } from 'class-validator';
import { isNullOrUndefined } from 'util';

export class CreateAssignmentDto {
  @IsInt()
  surveyId: number;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  endDate:Date;

  @IsString()
  @IsNotEmpty()
  userMail: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
}

export class completeAssignmentDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  surveyId: number;

}