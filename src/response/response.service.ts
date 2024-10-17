import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'src/response/entities/response.entity';
import { Question } from 'src/survey/entities/question.entity';
import { SaveResponsesDto } from './dto/save-response.dto';
import { ResponseMessage } from 'src/types/message';
import { SuccessHTTPAnswer, ThrowHTTPException } from 'src/shared/http.answer';
import { Survey } from 'src/survey/entities/survey.entity';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async saveResponses(saveResponsesDto: SaveResponsesDto): Promise<ResponseMessage<Response[]>> {
    const savedResponses: Response[] = [];

    for (const responseDto of saveResponsesDto.responses) {
      const question = await this.questionRepository.findOneBy({ id: responseDto.questionId });
      if (!question) {
        await ThrowHTTPException("Question not found", ["questionId"], 404, "QUESTION_NOT_FOUND");
      }

      const newResponse = new Response();
      newResponse.userId = saveResponsesDto.userId;
      newResponse.answer = responseDto.answer;
      newResponse.question = question;  // Asocia la respuesta a la pregunta

      savedResponses.push(await this.responseRepository.save(newResponse));
    }

    return SuccessHTTPAnswer("Responses saved successfully", savedResponses);
  }
  
  async getUserResponsesBySurvey(userId: number, surveyId: number): Promise<Response[]> {
    return this.responseRepository.find({
      where: {
        userId,
        question: {
          survey: {
            id: surveyId,
          },
        },
      },
      relations: ['question', 'question.survey'],  
    });
  }

  async getAnsweredSurveysByUser(userId: number): Promise<Survey[]> {
  // Obtener las respuestas del usuario
  const responses = await this.responseRepository.find({
      where: {
        userId,
      },
      relations: ['question', 'question.survey'],
  });
  
  const surveyIds = Array.from(new Set(responses.map(response => response.question.survey.id)));
  return this.questionRepository.manager.find(Survey, { where: { id: In(surveyIds) },});
  }
}