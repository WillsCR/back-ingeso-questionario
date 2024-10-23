import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'src/response/entities/response.entity';
import { SaveResponsesDto } from './dto/save-response.dto';
import { ResponseMessage } from 'src/types/message';
import { SuccessHTTPAnswer, ThrowHTTPException } from 'src/shared/http.answer';
import { Survey } from 'src/survey/entities/survey.entity';
import { Item } from 'src/survey/entities/item.entity';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,

    @InjectRepository(Item) 
    private readonly itemRepository: Repository<Item>,
  ) {}

  async saveResponses(saveResponsesDto: SaveResponsesDto): Promise<ResponseMessage<Response[]>> {
    const savedResponses: Response[] = [];

    for (const responseDto of saveResponsesDto.responses) {
      const item = await this.itemRepository.findOneBy({ id: responseDto.itemId }); 
      if (!item) {
        await ThrowHTTPException("Item not found", ["itemId"], 404, "ITEM_NOT_FOUND");
      }

      const newResponse = new Response();
      newResponse.userId = saveResponsesDto.userId;
      newResponse.answer = responseDto.answer;
      newResponse.itemId = item.id; // Asignar itemId en lugar de item

      savedResponses.push(await this.responseRepository.save(newResponse));
    }

    return SuccessHTTPAnswer("Responses saved successfully", savedResponses);
  }
  
  async getUserResponsesBySurvey(userId: number, surveyId: number): Promise<Response[]> {
    return this.responseRepository.find({
      where: {
        userId,
        itemId: In(
          // Obtiene todos los IDs de los ítems relacionados con la encuesta
          await this.itemRepository.find({ 
            where: { 
              dimension: { 
                survey: { 
                  id: surveyId 
                } 
              } 
            },
            relations: ['dimension']
          }).then(items => items.map(item => item.id))
        ),
      },
      relations: ['item'], // Mantén la relación para cargar el ítem
    });
  }

  async getAnsweredSurveysByUser(userId: number): Promise<Survey[]> {
    const responses = await this.responseRepository.find({
      where: {
        userId,
      },
      relations: ['item', 'item.dimension', 'item.dimension.survey'], 
    });
  
    // Cambia a dimension y luego survey
    const surveyIds = Array.from(new Set(responses.map(response => response.item.dimension.survey.id))); 
    return this.itemRepository.manager.find(Survey, { where: { id: In(surveyIds) } });
  }
}
