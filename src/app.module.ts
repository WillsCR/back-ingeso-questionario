import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyModule } from './survey/survey.module';
import { ResponseModule } from './response/response.module';
import { Response } from './response/entities/response.entity';
import { Item } from './survey/entities/item.entity'; 
import { Dimension } from './survey/entities/dimension.entity'; 
import { Survey } from './survey/entities/survey.entity';
import { SurveyAssignmentModule } from './userSurveyAssigment/userSurveyAssigment.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(
    {
      isGlobal: true,}
    ),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
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
    SurveyAssignmentModule
  ],
})
export class AppModule {}
