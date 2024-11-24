import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() createInfo: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const result = await this.userService.create(createInfo, files);
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
      const result = await this.userService.findOne(id);
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

  @Post('update-image')
  async updateImage(@Body() body: any) {
    const { id, images } = body;
    try {
      const result = await this.userService.updateDetectFaceImage(id, images);
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
      const result = await this.userService.findAll();
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

  // API để lấy lịch dạy của giáo viên trong khoảng thời gian
  @Get('schedule')
  async getTeacherSchedulesInRange(
    @Query('teacherId') teacherId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('isActive') isActive: boolean,
  ) {
    try {
      const schedules = await this.userService.getTeacherSchedulesInRange(
        teacherId,
        startDate,
        endDate,
        isActive,
      );
      return {
        status: 'SUCCESS',
        isSuccess: true,
        data: schedules,
      };
    } catch (error) {
      return {
        status: 'FAIL',
        isSuccess: false,
        message: error.message || 'Đã xảy ra lỗi',
      };
    }
  }
}
