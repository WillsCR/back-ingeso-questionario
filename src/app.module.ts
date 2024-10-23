import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyModule } from './survey/survey.module';
import { ResponseModule } from './response/response.module';
import { Response } from './response/entities/response.entity';
import { Item } from './survey/entities/item.entity'; 
import { Dimension } from './survey/entities/dimension.entity'; 
import { Survey } from './survey/entities/survey.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'DbEncuestasUcn',
      entities: [
        Survey,
        Item, 
        Dimension, 
        Response,
      ],
      autoLoadEntities: true,
      synchronize: true,
    }),
    SurveyModule,
    ResponseModule,
  ],
})
export class AppModule {}