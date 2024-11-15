import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { SurveyAssignmentService } from './userSurveyAssigment.service';
import { SurveyAssignment } from './entities/userSurveyAssigment.entity';
@Controller('survey-assignments')
export class SurveyAssignmentController {
  constructor(private readonly assignmentService: SurveyAssignmentService) {}

  @Post()
  async createAssignment(@Body() data: Partial<SurveyAssignment>): Promise<SurveyAssignment> {
    return this.assignmentService.createAssignment(data);
  }


  @Patch(':id/complete')
  async markAsCompleted(@Param('id') id: number): Promise<void> {
     await this.assignmentService.markAsCompleted(id);
   
  }

  
}