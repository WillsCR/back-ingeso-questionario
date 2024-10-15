import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ResponseService } from './response.service';
import { Response } from './entities/response.entity';
@Controller('responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  create(@Body() response: Response) {
    return this.responseService.create(response);
  }

  @Get()
  findAll() {
    return this.responseService.findAll();
  }

  @Get('survey/:surveyId')
  findBySurvey(@Param('surveyId') surveyId: string) {
    return this.responseService.findBySurvey(+surveyId);
  }
}