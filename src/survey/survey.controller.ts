import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { Survey } from './entities/survey.entity';
import { ResponseMessage } from 'src/types/message';

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  async create(@Body() createSurveyDto: CreateSurveyDto): Promise<ResponseMessage<Survey>> {
    return this.surveyService.create(createSurveyDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateSurveyDto: CreateSurveyDto): Promise<ResponseMessage<Survey>> {
    return this.surveyService.update(id, updateSurveyDto);
  }

  @Get()
  async findAll(): Promise<Survey[]> {
    return this.surveyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Survey> {
    return this.surveyService.findOne(id);
  }
}