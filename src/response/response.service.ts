import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from './entities/response.entity';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
  ) {}

  create(response: Response) {
    return this.responseRepository.save(response);
  }

  findAll() {
    return this.responseRepository.find({ relations: ['survey'] });
  }

  findBySurvey(surveyId: number) {
    return this.responseRepository.find({ where: { surveyId } });
  }
}

