import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  LabRepository,
  ScheduleRepository,
  UserRepository,
} from 'src/database/repository';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    LabRepository,
    ScheduleRepository,
    AuthService,
  ],
  imports: [],
})
export class UserModule {}
