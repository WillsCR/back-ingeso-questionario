import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyService } from './survey.service';
import { Survey } from './entities/survey.entity';
import { Response } from 'src/response/entities/response.entity';
import { Item } from './entities/item.entity'; 
import { Dimension } from './entities/dimension.entity'; 
import { SurveyController } from './survey.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Survey, Response, Item, Dimension]), 
  ],
  providers: [SurveyService], 
  controllers: [SurveyController], 
  exports: [SurveyService], 
})
export class SurveyModule {}