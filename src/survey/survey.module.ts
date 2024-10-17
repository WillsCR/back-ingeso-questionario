import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyService } from './survey.service';
import { Survey } from './entities/survey.entity';
import { Question } from './entities/question.entity';
import { Response } from 'src/response/entities/response.entity';
import { SurveyController } from './survey.controller'; @Module({
  imports: [
    TypeOrmModule.forFeature([Survey, Question, Response]), // Registrar las entidades
  ],
  providers: [SurveyService], // Registrar el servicio
  controllers: [SurveyController], // Registrar el controlador (opcional)
  exports: [SurveyService], // Exportar el servicio si lo necesitas en otros módulos
})
export class SurveyModule {}