import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from './response.service';
import { Response } from './entities/response.entity';
import { Question } from 'src/survey/entities/question.entity';
import { Survey } from 'src/survey/entities/survey.entity';
import { ResponseController } from './response.controller'; // Si tienes un controlador

@Module({
  imports: [
    TypeOrmModule.forFeature([Response, Question, Survey]), 
  ],
  providers: [ResponseService], 
  controllers: [ResponseController], 
  exports: [ResponseService], 
})
export class ResponseModule {}