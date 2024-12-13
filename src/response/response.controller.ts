import { Controller, Post, Body, Param, Get, NotFoundException } from '@nestjs/common';
import { ResponseService } from './response.service';
import { SaveResponsesDto } from './dto/save-response.dto';
import { Survey } from 'src/survey/entities/survey.entity';
import { ResponseMessage } from 'src/types/message';

@Controller('responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  async save(@Body() saveResponsesDto: SaveResponsesDto): Promise<ResponseMessage<void>>{
    return await this.responseService.saveResponses(saveResponsesDto);
  }

  @Post('/delete/:id')
  async deleteResponseById(@Param('id') id: number): Promise<void> {
    await this.responseService.deleteResponseById(id);
  }

  @Get('/survey/:userId/:subject')
  async findSurveyByUserandSubject(@Param('userId') userId: number, @Param('subject') subject: string): Promise<ResponseMessage<Survey>> {
    return await this.responseService.findSurveyByUserandSubject(userId, subject);
  }

  @Get('/subject/:subject')
  async findSurveysAnsweredBySubject(@Param('subject') subject: string): Promise<Survey[]> {
    return await this.responseService.findSurveysAnsweredBySubject(subject);
  }

  @Get('/user/:userId')
  async findSurveysAnsweredByUser(@Param('userId') userId: number): Promise<ResponseMessage<Survey[]>> {
    return await this.responseService.findSurveysAnsweredByUser(userId);
  }
  @Get('/survey/:surveyId/user/:userId')
  async findAnswersBySurveyAndUser(@Param('surveyId') surveyId: number, @Param('userId') userId: number): Promise<any> {
    const response = await this.responseService.getResponsesByUserAndSurvey(userId, surveyId);

    if (!response.success) {
      throw new NotFoundException(response.message);
    }

    return response;
  }
}