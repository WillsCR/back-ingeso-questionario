import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { SurveyAssignmentService } from './userSurveyAssigment.service';
import { SurveyAssignment } from './entities/userSurveyAssigment.entity';
import { completeAssignmentDto, CreateAssignmentDto } from './dto/surveyAssigment.dto';
@Controller('survey-assignments')
export class SurveyAssignmentController {
  constructor(private readonly assignmentService: SurveyAssignmentService) {}

  // asignar usuario a una encuesta y ponerle fecha limite 
  @Post()
  async createAssignment(@Body() data: CreateAssignmentDto ): Promise<SurveyAssignment> {
    return this.assignmentService.createAssignment(data);
  }

  
  @Post('complete')
  async markAsCompleted(@Body()data: completeAssignmentDto ) : Promise<String> {
    const response = await this.assignmentService.markAsCompleted(data.userId, data.surveyId);
    return response;
  }

  @Get('uncompleted')
  async getUncompletedAssignments(): Promise<SurveyAssignment[]> {
    return this.assignmentService.getUncompletedAssignments();
  }

  @Get('completed')
  async getCompletedAssignments(): Promise<SurveyAssignment[]> {
    return this.assignmentService.getCompletedAssignments();
  }

  @Post('reminder/:userMail/:endDate')
async testsendEmail(
  @Param('userMail') userMail: string,
  @Param('endDate') endDate: string 
) {
  const dateObject = new Date(endDate); 
  console.log(dateObject);
  if (isNaN(dateObject.getTime())) {
    throw new Error('La fecha proporcionada no es válida');
  }

  await this.assignmentService.testsendEmail(userMail, dateObject);
}

  @Get('has-deadline/:surveyId')
  async surveyHasDeadline(@Param('surveyId') surveyId: number): Promise<boolean> {
    return this.assignmentService.surveyHasDeadline(surveyId);
  }
}