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
  //OBTIENE RESPUESTAS POR USUARIO y ENCUESTA
  @Get('user/:userId/survey/:surveyId') 
  async getUserResponsesBySurvey(@Param('userId') userId: string, @Param('surveyId') surveyId: string): Promise<Response[]> {
    
    return this.responseService.getUserResponsesBySurvey(+userId, +surveyId); 
  }
  //RESPUESTAS POR USUARIO
  @Get('/answered-surveys/:userId')
  async getAnsweredSurveysByUser(@Param('userId') userId: number) {
    const surveys = await this.responseService.getAnsweredSurveysByUser(userId);
    if (!surveys.length) {
      throw new NotFoundException('No answered surveys found for the given user.');
    }
    return surveys;
  }
  //OBTIENES LAS RESPUESTAS DE UN USUARIO POR ASIGNATURA
  @Get('/user/:userId/subject/:subject')
  async getUserResponsesBySubject(@Param('userId') userId: string, @Param('subject') subject: string): Promise<Response[]> {
    const responses = await this.responseService.getUserResponsesBySubject(+userId, subject);
    if (!responses.length) {
      throw new NotFoundException('No responses found for the given user and subject.');
    }
    return responses;
  }
  //OBTIENE RESPUESTAS POR ASIGNATURA
  @Get ('/subject/:subject')
  async getAnswerbySubject( subject: string): Promise<Response[]> {
    const responses = await this.responseService.getAnswerbySubject(subject);
    if (!responses.length) {
      throw new NotFoundException('No responses found for the given subject.');
    }
    return responses;
  }
}