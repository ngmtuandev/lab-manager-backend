import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Param,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('create-schedule')
  async create(
    @Body()
    scheduleData: {
      teacherId: number;
      labId: number;
      date: Date;
      startTime: string;
      endTime: string;
      name: string; // Thêm trường name vào request body
    },
  ) {
    try {
      const newSchedule =
        await this.scheduleService.createSchedule(scheduleData);
      return {
        status: 'SUCCESS',
        isSuccess: true,
        data: newSchedule,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Đã xảy ra lỗi');
    }
  }

  // find by teacher
  @Get('teacher/:teacherId')
  async getSchedulesByTeacher(@Param('teacherId') teacherId: number) {
    try {
      const schedules =
        await this.scheduleService.getSchedulesByTeacher(teacherId);
      return {
        status: 'SUCCESS',
        data: schedules,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Đã xảy ra lỗi');
    }
  }
}
