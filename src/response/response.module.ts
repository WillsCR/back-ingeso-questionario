import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from './response.service';
import { Response } from './entities/response.entity';
import { Item } from 'src/survey/entities/item.entity'; 
import { Dimension } from 'src/survey/entities/dimension.entity'; 
import { ResponseController } from './response.controller'; 
import { Survey } from 'src/survey/entities/survey.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Response, Item, Dimension,Survey,]), 
  ],
  providers: [ResponseService], 
  controllers: [ResponseController], 
  exports: [ResponseService], 
})
export class ResponseModule {}