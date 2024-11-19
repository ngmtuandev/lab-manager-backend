import { Module } from '@nestjs/common';
import {
  LabRepository,
  ScheduleRepository,
  UserRepository,
} from 'src/database/repository';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { MailController } from '../mailer/MailController';
import { MailService } from '../mailer/MailService';

@Module({
  controllers: [ScheduleController, MailController],
  providers: [
    ScheduleService,
    ScheduleRepository,
    UserRepository,
    LabRepository,
    MailService,
  ],
  imports: [],
})
export class ScheduleModule {}
