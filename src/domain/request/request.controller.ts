import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from 'src/dto';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('create-request')
  async create(@Body() dataCreate: CreateRequestDto) {
    try {
      const result = await this.requestService.createNewRequest(dataCreate);
      return result;
    } catch (error) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: error,
      };
    }
  }

  @Get('find-all')
  async findAll(@Query('isAccept') isAccept: boolean) {
    try {
      const result = await this.requestService.findAll(isAccept);
      return result;
    } catch (error) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: error,
      };
    }
  }

  @Get('find-by-teacher')
  async findByTeacher(
    @Query('isAccept') isAccept: boolean,
    @Query('userId') userId: number,
  ) {
    try {
      const result = await this.requestService.findOneByUserId(
        isAccept,
        userId,
      );
      return result;
    } catch (error) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: error,
      };
    }
  }
}
