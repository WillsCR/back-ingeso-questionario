import { Injectable } from '@nestjs/common';
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
    // Crear nueva encuesta
    const newSurvey = new Survey();
    newSurvey.title = createSurveyDto.title;
    newSurvey.description = createSurveyDto.description;
    newSurvey.subjectName = createSurveyDto.subjectName;
    newSurvey.professorName = createSurveyDto.professorName;
    newSurvey.studentName = createSurveyDto.studentName;

    // Crear dimensiones y asociar ítems
    newSurvey.dimensions = await Promise.all(
        createSurveyDto.dimensions.map(async (dimensionDto) => {
            const dimension = new Dimension();
            dimension.name = dimensionDto.name;

            // Crear ítems y asociarlos a la dimensión
            dimension.items = await Promise.all(
                dimensionDto.items.map(async (itemDto) => {
                    const item = new Item();
                    item.text = itemDto.text;

                    // Asociar el ítem a la dimensión
                    item.dimension = dimension; // Necesario para mantener la relación

                    // Guardar el ítem
                    return this.itemRepository.save(item);
                })
            );

            // Guardar la dimensión
            return this.dimensionRepository.save(dimension);
        })
    );

    // Guardar la encuesta con dimensiones e ítems
    const savedSurvey = await this.surveyRepository.save(newSurvey);

    return {
        success: true,
        message: 'Survey created successfully',
        data: savedSurvey,
    };
  }

  async update(id: number, updateSurveyDto: CreateSurveyDto): Promise<ResponseMessage<Survey>> {
    const survey = await this.findOne(id);
    survey.title = updateSurveyDto.title;
    survey.description = updateSurveyDto.description;
    survey.subjectName = updateSurveyDto.subjectName;
    survey.professorName = updateSurveyDto.professorName;
    survey.studentName = updateSurveyDto.studentName;

    // Actualizar las dimensiones e ítems si es necesario
    survey.dimensions = await Promise.all(
        updateSurveyDto.dimensions.map(async (dimensionDto) => {
            const dimension = new Dimension();
            dimension.name = dimensionDto.name;

            // Crear ítems y asociarlos a la dimensión
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
