import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { FindOneHistoryDto } from 'src/dto/history/FindOneHistoryDto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post('create-checkin')
  async create(@Body() createInfo: any) {
    try {
      const result = await this.historyService.createCheckin(createInfo);
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

  @Post('create-checkout')
  async createCheckout(@Body() createCheckout: any) {
    try {
      const result = await this.historyService.createCheckout(createCheckout);
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

  @Get('lab-stats')
  async getLabCheckinCheckoutCount(
    @Query('labId') labId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      const count = await this.historyService.getLabCheckinCheckoutCount(
        labId,
        startDate,
        endDate,
      );
      return {
        status: 'SUCCESS',
        isSuccess: true,
        data: { count },
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Đã xảy ra lỗi');
    }
  }

  // API để lấy chi tiết lượt checkin/checkout của phòng trong khoảng thời gian
  @Get('lab-details')
  async getLabCheckinCheckoutDetails(
    @Query('labId') labId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      const details = await this.historyService.getLabCheckinCheckoutDetails(
        labId,
        startDate,
        endDate,
      );
      return {
        status: 'SUCCESS',
        isSuccess: true,
        data: details,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Đã xảy ra lỗi');
    }
  }

  // @Post('find-by-lab')
  // async findByLab(@Body() labId: any) {
  //   console.log('labId ============>   ', labId);
  //   try {
  //     const result = await this.historyService.findActiveByLab(labId?.labId);
  //     console.log('result : ----->  ', result);
  //     if (result) {
  //       return {
  //         status: 'SUCCESS',
  //         isSuccess: true,
  //         data: result,
  //       };
  //     } else {
  //       return {
  //         status: 'FAIL',
  //         isSuccess: false,
  //       };
  //     }
  //   } catch (error) {
  //     return {
  //       status: 'FAIL',
  //       isSuccess: false,
  //     };
  //   }
  // }

  // @Post('find-one')
  // async findOne(@Body() findOneDto: FindOneHistoryDto) {
  //   const { userId, day, month } = findOneDto;
  //   try {
  //     const result = await this.historyService.findByUser(userId, day, month);
  //     if (result) {
  //       return {
  //         status: 'SUCCESS',
  //         isSuccess: true,
  //         data: result,
  //       };
  //     } else {
  //       return {
  //         status: 'FAIL',
  //         isSuccess: false,
  //       };
  //     }
  //   } catch (error) {
  //     return {
  //       status: 'FAIL',
  //       isSuccess: false,
  //     };
  //   }
  // }

  // @Post('find-all')
  // async findAll() {
  //   try {
  //     const result = await this.historyService.findAll();
  //     if (result) {
  //       return {
  //         status: 'SUCCESS',
  //         isSuccess: true,
  //         data: result,
  //       };
  //     } else {
  //       return {
  //         status: 'FAIL',
  //         isSuccess: false,
  //       };
  //     }
  //   } catch (error) {
  //     return {
  //       status: 'FAIL',
  //       isSuccess: false,
  //     };
  //   }
  // }
}
