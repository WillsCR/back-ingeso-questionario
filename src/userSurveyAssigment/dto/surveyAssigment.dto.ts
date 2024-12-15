import { IsNotEmpty, IsDateString, IsString, IsInt, isNotEmpty, IsNumber } from 'class-validator';
import { isNullOrUndefined } from 'util';

export class CreateAssignmentDto {
  @IsInt()
  surveyId: number;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsDateString()
  endDate:Date;

  @IsString()
  @IsNotEmpty()
  userMail: string;
  //Asignatura (subjetc)
  @IsString()
  @IsNotEmpty()
  signature: string;
}
// -> asignas un usuario a una encuesta  {fecha limite}
export class completeAssignmentDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  surveyId: number;

}