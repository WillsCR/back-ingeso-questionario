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

    
    const responsePromises = saveResponsesDto.responses.map(async (responseDto) => {
      const item = await this.itemRepository.findOne({
        where: { id: responseDto.itemId },
      });

      if (!item) {
        throw await ThrowHTTPException("Item not found", ["itemId"], 404, "ITEM_NOT_FOUND");
      }

      const newResponse = this.responseRepository.create({
        userId: saveResponsesDto.userId,
        answer: responseDto.answer,
        item, 
      });

      return this.responseRepository.save(newResponse);
    });

    savedResponses.push(...await Promise.all(responsePromises));

    return SuccessHTTPAnswer("Responses saved successfully", savedResponses);
  }

  async getUserResponsesBySurvey(userId: number, surveyId: number): Promise<Response[]> {
    
    const itemIds = await this.itemRepository.find({
      where: {
        dimension: {
          survey: { id: surveyId },
        },
      },
      relations: ['dimension'],
    }).then(items => items.map(item => item.id));
  
    
    return this.responseRepository.find({
      where: {
        userId,
        item: { id: In(itemIds) }, 
      },
      relations: ['item'], 
    });
  }

  async getAnsweredSurveysByUser(userId: number): Promise<Survey[]> {
    const responses = await this.responseRepository.find({
      where: { userId },
      relations: ['item', 'item.dimension', 'item.dimension.survey'],
    });

    const surveyIds = Array.from(new Set(responses.map(res => res.item.dimension.survey.id)));

    return this.itemRepository.manager.find(Survey, { where: { id: In(surveyIds) } });
  }
}