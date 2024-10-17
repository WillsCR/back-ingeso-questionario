import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyModule } from './survey/survey.module';
import { ResponseModule } from './response/response.module';
import { Response } from './response/entities/response.entity';
import { Question } from './survey/entities/question.entity';
import { Survey } from './survey/entities/survey.entity';

@Module({

  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432, 
      username: 'postgres',
      password: 'postgres',
      database: 'SurveyDB',
      entities: [
        Survey,
        Question,
        Response
      ],
      autoLoadEntities: true,
      synchronize: true,
    }),
    SurveyModule,
    ResponseModule,
  ],
})
export class AppModule {}