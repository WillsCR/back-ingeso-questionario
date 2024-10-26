import { Controller, Post, Body, Param, Get, NotFoundException } from '@nestjs/common';
import { ResponseService } from './response.service';
import { SaveResponsesDto } from './dto/save-response.dto';
import { ResponseMessage } from 'src/types/message';
import { Response } from 'src/response/entities/response.entity';

@Controller('responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  async save(@Body() saveResponsesDto: SaveResponsesDto): Promise<ResponseMessage<Response[]>> {
    return this.responseService.saveResponses(saveResponsesDto);
  }

  @Get('user/:userId/survey/:surveyId') 
  async getUserResponsesBySurvey(@Param('userId') userId: string, @Param('surveyId') surveyId: string): Promise<Response[]> {
    
    return this.responseService.getUserResponsesBySurvey(+userId, +surveyId); 
  }
  
  @Get('/answered-surveys/:userId')
  async getAnsweredSurveysByUser(@Param('userId') userId: number) {
    const surveys = await this.responseService.getAnsweredSurveysByUser(userId);
    if (!surveys.length) {
      throw new NotFoundException('No answered surveys found for the given user.');
    }
    return surveys;
  }
}