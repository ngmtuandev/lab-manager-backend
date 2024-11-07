import { Body, Controller, Post } from '@nestjs/common';
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

  @Post('find-by-lab')
  async findByLab(@Body() labId: any) {
    console.log('labId ============>   ', labId);
    try {
      const result = await this.historyService.findActiveByLab(labId?.labId);
      console.log('result : ----->  ', result);
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
  async findOne(@Body() findOneDto: FindOneHistoryDto) {
    const { userId, day, month } = findOneDto;
    try {
      const result = await this.historyService.findByUser(userId, day, month);
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

  @Post('find-all')
  async findAll() {
    try {
      const result = await this.historyService.findAll();
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
}
