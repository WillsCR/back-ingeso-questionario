import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'src/response/entities/response.entity';
import { SaveResponsesDto } from './dto/save-response.dto';
import { ResponseMessage } from 'src/types/message';
import { Survey } from 'src/survey/entities/survey.entity';
import { Item } from 'src/survey/entities/item.entity';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,

    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,

    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,

  ) {}

  async saveResponses(saveResponsesDto: SaveResponsesDto): Promise<ResponseMessage<void>> {
    const { userId, responses, subject, surveyId } = saveResponsesDto; 

    try {
      await Promise.all(
        responses.map(async (responseItemDto) => {
          const response = new Response();
          response.userId = userId;
          response.subject = subject;
          response.answer = responseItemDto.answer;
          const survey = await this.surveyRepository.findOne({ where: { id: surveyId } });
          
          if (!survey) {
            throw new Error(`Survey with ID ${surveyId} not found`);
          }

          response.survey = survey;

          const item = await this.itemRepository.findOne({
            where: { id: responseItemDto.itemId },
            relations: ['dimension'],
          });

          if (!item) {
            throw new Error(`Item with ID ${responseItemDto.itemId} not found`);
          }

          response.item = item;

          await this.responseRepository.save(response);
        })
      );

      return {
        success: true,
        message: 'Responses saved successfully',
        data: null,
      };
    } catch (error) {
      console.error('Error saving responses:', error);
      throw new InternalServerErrorException('Could not save responses');
    }
  }
  async deleteResponseById(id: number): Promise<ResponseMessage<void>> {
    try {
      const response = await this.responseRepository.findOne({ where: { id } });
  
      if (!response) {
        throw new Error(`Response with ID ${id} not found`);
      }
  
      await this.responseRepository.remove(response);
  
      return {
        success: true,
        message: `Response with ID ${id} deleted successfully`,
        data: null,
      };
    } catch (error) {
      console.error('Error deleting response:', error);
      throw new InternalServerErrorException('Could not delete response');
    }
  }
  async findSurveyByUserandSubject(userId: number, subject: string): Promise<ResponseMessage<Survey>> {
    try {
      // Busca todas las respuestas del usuario para una asignatura y relaciona los ítems y encuestas
      const responses = await this.responseRepository.find({
        where: { userId, subject },
        relations: ['item', 'item.dimension', 'item.dimension.survey'],
      });
  
      if (responses.length === 0) {
        return {
          success: false,
          message: 'No responses found for the user',
          data: null,
        };
      }
  
      // Tomamos la encuesta asociada a la primera respuesta
      const survey = responses[0].item.dimension.survey;
  
      // Agregamos las dimensiones y los ítems relacionados
      survey.dimensions = await Promise.all(
        survey.dimensions.map(async (dimension) => {
          // Cargar todos los ítems asociados a la dimensión
          const items = await this.itemRepository.find({
            where: { dimension: { id: dimension.id } },
            relations: ['responses'],
          });
  
          // Mapear las respuestas de cada ítem
          dimension.items = items.map((item) => {
            item.responses = item.responses.filter(
              (response) => response.userId === userId
            );
            return item;
          });
  
          return dimension;
        })
      );
  
      return {
        success: true,
        message: 'Survey and responses retrieved successfully',
        data: survey,
      };
    } catch (error) {
      console.error('Error finding survey by user:', error);
      throw new InternalServerErrorException('Could not retrieve survey');
    }
  }

  async findSurveysAnsweredBySubject(subject: string): Promise<Survey[]> {
    try {
      const surveys = await this.surveyRepository.find({
        where: { subject },  
        relations: ['assignments', 'dimensions', 'dimensions.items', 'dimensions.items.responses'], 
      });
  
      
      const answeredSurveys = surveys.filter(survey => {
        return survey.dimensions.some(dimension => 
          dimension.items.some(item => item.responses.length > 0)  
        );
      });
  
      return answeredSurveys;
    } catch (error) {
      console.error('Error fetching surveys answered by subject:', error);
      throw new InternalServerErrorException('Could not fetch answered surveys');
    }
  }
   // Función común que puede ser usada tanto para encontrar encuestas por usuario como por materia
   private async findSurveysByFilter(filter: { userId?: number; subject?: string }): Promise<Survey[]> {
    try {
      // Busca todas las respuestas basadas en el filtro proporcionado (userId o subject)
      const responses = await this.responseRepository.find({
        where: filter,
        relations: ['item', 'item.dimension', 'item.dimension.survey'],
      });

      // Si no hay respuestas, no hay encuestas asociadas
      if (responses.length === 0) {
        return [];
      }

      // Filtramos las encuestas únicas (sin duplicados) de las respuestas encontradas
      const surveys = responses
        .map((response) => response.item.dimension.survey)
        .filter((survey, index, self) => 
          self.findIndex((s) => s.id === survey.id) === index // Filtrar encuestas duplicadas
        );

      // Agregar dimensiones e ítems a las encuestas
      for (const survey of surveys) {
        if (survey.dimensions) {
          survey.dimensions = await Promise.all(
            survey.dimensions.map(async (dimension) => {
              const items = await this.itemRepository.find({
                where: { dimension: { id: dimension.id } },
                relations: ['responses'],
              });

              // Filtrar las respuestas de cada ítem para el usuario
              dimension.items = items.map((item) => {
                item.responses = item.responses.filter(
                  (response) => response.userId === filter.userId
                );
                return item;
              });

              return dimension;
            })
          );
        }
      }

      return surveys;
    } catch (error) {
      console.error('Error finding surveys by filter:', error);
      throw new InternalServerErrorException('Could not retrieve surveys');
    }
  }

  // Función para encontrar encuestas respondidas por usuario
  async findSurveysAnsweredByUser(userId: number): Promise<ResponseMessage<Survey[]>> {
    const surveys = await this.findSurveysByFilter({ userId });
    
    if (surveys.length === 0) {
      return {
        success: false,
        message: 'No surveys found for the user',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Surveys answered by user retrieved successfully',
      data: surveys,
    };
  }

  async getResponsesByUserAndSurvey(userId: number, surveyId: number): Promise<ResponseMessage<Response[]>> {
    try {
      const responses = await this.responseRepository.find({
        where: { userId, item: { dimension: { survey: { id: surveyId } } } },
        relations: ['item', 'item.dimension', 'item.dimension.survey'],
      });
  
      if (responses.length === 0) {
        return {
          success: false,
          message: 'No responses found for the user',
          data: null,
        };
      }
  
      return {
        success: true,
        message: 'Responses retrieved successfully',
        data: responses,
      };
    } catch (error) {
      console.error('Error finding responses by user and survey:', error);
      throw new InternalServerErrorException('Could not retrieve responses');
    }
  }
}