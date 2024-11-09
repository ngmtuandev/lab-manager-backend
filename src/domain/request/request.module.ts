import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import {
  LabRepository,
  RequestRepository,
  ScheduleRepository,
  UserRepository,
} from 'src/database/repository';

@Module({
  controllers: [RequestController],
  providers: [
    RequestService,
    RequestRepository,
    UserRepository,
    ScheduleRepository,
    LabRepository,
  ],
  imports: [],
})
export class RequestModule {}
