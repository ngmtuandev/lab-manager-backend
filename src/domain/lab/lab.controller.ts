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

  @Get('filter')
  async getFilteredLabs(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.labService.getLabsByStatusAndSchedule(start, end);
  }

  @Get('status')
  async getLabsStatus(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      if (!startDate || !endDate) {
        throw new BadRequestException('startDate and endDate are required');
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      const labs = await this.labService.getAllLabsStatus(start, end);

      // Transform data to desired format
      const formattedLabs = labs.map((lab) => ({
        id: lab.id,
        name: lab.nameLab,
        isInUse: lab.isDoingUse,
        hasActiveHistory: lab.histories.length > 0,
        scheduledDates: lab.schedules.map((schedule) => ({
          date: schedule.date,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          teacherId: schedule.teacher?.id,
          teacherName: schedule.teacher?.userName,
        })),
      }));

      return {
        status: 'SUCCESS',
        isSuccess: true,
        data: formattedLabs,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'An error occurred');
    }
  }
}
