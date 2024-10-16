import { Controller, Post, Body } from '@nestjs/common';
import { ResponseService } from './response.service';
import { SaveResponsesDto } from './dto/save-response.dto';
import { ResponseMessage } from 'src/types/message';
import { Response } from 'src/response/entities/response.entity';

@Controller('responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  async save(@Body() saveResponsesDto: SaveResponsesDto): Promise<ResponseMessage<Response[]>> {
    return this.responseService.saveResponses(saveResponsesDto);
  }
}