import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { LabService } from './lab.service';
import { CreateLabDto } from 'src/dto';

@Controller('lab')
export class LabController {
  constructor(private readonly labService: LabService) {}

  @Post('create')
  async create(@Body() createInfo: CreateLabDto) {
    try {
      const result = await this.labService.create(createInfo);
      if (result) {
        return {
          status: 'SUCCESS',
          isSuccess: true,
          data: result,
        };
      } else {
        return {
          status: 'FAIL',
          isSuccess: false,
        };
      }
    } catch (error) {
      return {
        status: 'FAIL',
        isSuccess: false,
      };
    }
  }

  @Post('find-one')
  async findOne(@Body() id: any) {
    try {
      const result = await this.labService.findOne(id);
      if (result) {
        return {
          status: 'SUCCESS',
          isSuccess: true,
          data: result,
        };
      } else {
        return {
          status: 'FAIL',
          isSuccess: false,
        };
      }
    } catch (error) {
      return {
        status: 'FAIL',
        isSuccess: false,
      };
    }
  }

  @Post('update-room-empty')
  async updateRoomEmpty(@Body() id: any) {
    try {
      const result = await this.labService.updateStatusUseLab(id);
      if (result) {
        return {
          status: 'SUCCESS',
          isSuccess: true,
        };
      } else {
        return {
          status: 'FAIL',
          isSuccess: false,
        };
      }
    } catch (error) {
      return {
        status: 'FAIL',
        isSuccess: false,
      };
    }
  }

  @Post('find-all')
  async findAll() {
    try {
      const result = await this.labService.findAll();
      if (result) {
        return {
          status: 'SUCCESS',
          isSuccess: true,
          data: result,
        };
      } else {
        return {
          status: 'FAIL',
          isSuccess: false,
        };
      }
    } catch (error) {
      return {
        status: 'FAIL',
        isSuccess: false,
      };
    }
  }

  // API để lấy lịch sử dụng của phòng trong khoảng thời gian
  @Get('scheduled-dates')
  async getScheduledDatesInRange(
    @Query('labId') labId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      const scheduledDates = await this.labService.getScheduledDatesInRange(
        labId,
        startDate,
        endDate,
      );
      return {
        status: 'SUCCESS',
        isSuccess: true,
        data: scheduledDates,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Đã xảy ra lỗi');
    }
  }

  // API để lấy các ngày phòng trống trong khoảng thời gian
  @Get('available-dates')
  async getAvailableDatesInRange(
    @Query('labId') labId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      const availableDates = await this.labService.getAvailableDatesInRange(
        labId,
        startDate,
        endDate,
      );
      return {
        status: 'SUCCESS',
        isSuccess: true,
        data: availableDates,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Đã xảy ra lỗi');
    }
  }
}
