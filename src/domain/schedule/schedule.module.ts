import { Module } from '@nestjs/common';
import {
  LabRepository,
  ScheduleRepository,
  UserRepository,
} from 'src/database/repository';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';

@Module({
  controllers: [ScheduleController],
  providers: [
    ScheduleService,
    ScheduleRepository,
    UserRepository,
    LabRepository,
  ],
  imports: [],
})
export class ScheduleModule {}
