import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { NotifyService } from './notify.service';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Post('create')
  async createNotify(@Body() notifyRequest: any) {
    const notify = await this.notifyService.createNotify(notifyRequest);
    if (!notify) {
      return {
        message: 'Failed to create notify',
        status: 400,
        isSuccess: false,
      };
    }
    return {
      message: 'Notify created successfully',
      status: 200,
      isSuccess: true,
    };
  }

  @Get('get-and-mark-as-read')
  async getAndMarkAsRead(@Query('userId') userId: number) {
    console.log('user id', userId);
    // Change type to string
    if (!userId) {
      return {
        message: 'userId is required',
        status: 400,
        isSuccess: false,
      };
    }
    const notify = await this.notifyService.getAndMarkAsRead(Number(userId));
    console.log('notify ----> ', notify);
    if (!notify) {
      return {
        message: 'Failed to fetch notify',
        status: 400,
        isSuccess: false,
      };
    }
    if (notify?.length <= 0) {
      return {
        message: 'Failed to fetch notify',
        status: 400,
        isSuccess: false,
      };
    } else {
      return {
        message: 'Notify fetched successfully',
        status: 200,
        isSuccess: true,
        data: notify,
      };
    }
  }
}
