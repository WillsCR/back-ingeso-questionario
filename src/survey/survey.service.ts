import { Injectable } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { Survey } from './entities/survey.entity';
import { Response } from 'src/response/entities/response.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { ResponseMessage } from 'src/types/message';
import { SuccessHTTPAnswer, ThrowHTTPException } from 'src/shared/http.answer';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,

    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,
  ) {}
  //falta la validacion de http
  async create(createSurveyDto: CreateSurveyDto): Promise<ResponseMessage<Survey>> {
    const survey : Survey  = await this.findOne(createSurveyDto.surveyId);
    if (survey) {
      return ThrowHTTPException ("Survey already exists", ["surveyId"], 400, "SURVEY_ALREADY_EXISTS");
    }
    const newSurvey = new Survey();
    newSurvey.title = createSurveyDto.title;
    newSurvey.description = createSurveyDto.description;

    
    newSurvey.responses = createSurveyDto.responses.map(responseDto => {
      const response = new Response();
      response.userId = responseDto.userId;
      response.answer = responseDto.answer;
      return response;
    });

    const savedSurvey = await this.surveyRepository.save(newSurvey);
    await this.responseRepository.save(newSurvey.responses.map(response => {
      response.survey = savedSurvey; 
      return response;
    }));

    return SuccessHTTPAnswer("Survey created successfully", savedSurvey);
  }
  async update(id: number, updateSurveyDto: CreateSurveyDto): Promise<ResponseMessage<Survey>> {
    const survey = await this.findOne(id);
    survey.title = updateSurveyDto.title;
    survey.description = updateSurveyDto.description;

    return SuccessHTTPAnswer("Survey updated successfully", await this.surveyRepository.save(survey));
  }
  async findAll(): Promise<Survey[]> {
    return this.surveyRepository.find();
  }

  async findOne(id: number): Promise<Survey> {
    return this.surveyRepository.findOneBy({ id });
  }
}
