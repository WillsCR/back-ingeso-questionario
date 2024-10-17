import { Injectable } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { Survey } from './entities/survey.entity';
import { Response } from 'src/response/entities/response.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { ResponseMessage } from 'src/types/message';
import { SuccessHTTPAnswer, ThrowHTTPException } from 'src/shared/http.answer';
import { Question } from './entities/question.entity';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,

    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,
  ) {}
  //se puede ocupar tambien solo poniendo los 
  //atributos pero mejor poner el dto
  async create(createSurveyDto: CreateSurveyDto): Promise<ResponseMessage<Survey>> {
    const newSurvey = new Survey();
    newSurvey.title = createSurveyDto.title;
    newSurvey.description = createSurveyDto.description;
  
    // Crear preguntas y asociar respuestas si se proporcionan
    newSurvey.questions = createSurveyDto.questions.map(questionDto => {
      const question = new Question();
      question.text = questionDto.text;
  
      // Crear respuestas si se proporcionan
      if (questionDto.responses) {
        question.responses = questionDto.responses.map(responseDto => {
          const response = new Response();
          response.userId = responseDto.userId;
          response.answer = responseDto.answer;
          return response;
        });
      }
  
      return question;
    });
    
    const savedSurvey = await this.surveyRepository.save(newSurvey);
    
    
    for (const question of newSurvey.questions) {
      await this.responseRepository.save(question.responses);
    }
  
    return {
      success: true,
      message: 'Survey created successfully',
      data: savedSurvey
    };
  }
  async update(id: number, updateSurveyDto: CreateSurveyDto): Promise<ResponseMessage<Survey>> {
    const survey = await this.findOne(id);
    survey.title = updateSurveyDto.title;
    survey.description = updateSurveyDto.description;

  return {success: true, 
          message: 'Survey updated successfully', 
          data: await this.surveyRepository.save(survey)}; ;
  }
  async findAll(): Promise<Survey[]> {
    return this.surveyRepository.find();
  }

  async findOne(id: number): Promise<Survey> {
    return this.surveyRepository.findOneBy({ id });
  }
}
