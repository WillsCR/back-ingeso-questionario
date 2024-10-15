import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { Survey } from './entities/survey.entity';

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  create(@Body() survey: Survey) {
    return this.surveyService.create(survey);
  }

  @Get()
  findAll() {
    return this.surveyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveyService.findOne(+id);
  }
}