import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { Survey } from './entities/survey.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'; 
import { ResponseMessage } from 'src/types/message';
import { Dimension } from './entities/dimension.entity';
import { Item } from './entities/item.entity';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,

    @InjectRepository(Dimension)
    private readonly dimensionRepository: Repository<Dimension>,

    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createSurveyDto: CreateSurveyDto): Promise<ResponseMessage<Survey>> {
    const newSurvey = new Survey();
    newSurvey.title = createSurveyDto.title;
    newSurvey.description = createSurveyDto.description;
  
    try {
      const savedSurvey = await this.surveyRepository.save(newSurvey);
      
      
      await Promise.all(
        createSurveyDto.dimensions.map(async (dimensionDto) => {
          const dimension = new Dimension();
          dimension.name = dimensionDto.name;
          dimension.tipo = dimensionDto.tipo;
          dimension.survey = savedSurvey; 
  
          const savedDimension = await this.dimensionRepository.save(dimension);
  
          
          await Promise.all(
            dimensionDto.items.map(async (itemDto) => {
              const item = new Item();
              item.text = itemDto.text;
              item.dimension = savedDimension; 
              await this.itemRepository.save(item);
            })
          );
        })
      );
  
      return {
        success: true,
        message: 'Survey created successfully',
        data: savedSurvey,
      };
    } catch (error) {
      console.error("Error creating survey:", error);
      throw new InternalServerErrorException('Could not create survey');
    }
  }
  
  
  async update(id: number, updateSurveyDto: CreateSurveyDto): Promise<ResponseMessage<Survey>> {
    const survey = await this.findOne(id);
    survey.title = updateSurveyDto.title;
    survey.description = updateSurveyDto.description;

    // Actualizar dimensiones e ítems
    survey.dimensions = await Promise.all(
      updateSurveyDto.dimensions.map(async (dimensionDto) => {
        const dimension = new Dimension();
        dimension.name = dimensionDto.name;
  
        dimension.items = await Promise.all(
          dimensionDto.items.map(async (itemDto) => {
            const item = new Item();
            item.text = itemDto.text;
  
            // Asociar el ítem a la dimensión
            item.dimension = dimension;
  
            // Guardar el ítem
            return this.itemRepository.save(item);
          })
        );
  
        // Guardar la dimensión
        return this.dimensionRepository.save(dimension);
      })
    );
  
    // Guardar la encuesta actualizada
    const updatedSurvey = await this.surveyRepository.save(survey);
    return {
      success: true,
      message: 'Survey updated successfully',
      data: updatedSurvey,
    };
  }
  

  async findAll(): Promise<Survey[]> {
    return this.surveyRepository.find({
      relations: ['dimensions', 'dimensions.items'],
    });
  }

  async findOne(id: number): Promise<Survey> {
    return this.surveyRepository.findOne({
      where: { id },
      relations: ['dimensions', 'dimensions.items'],
    });
  }
}
