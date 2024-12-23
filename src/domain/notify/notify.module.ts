import { Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { NotifyRepository } from 'src/database/repository/notify.repository';
import { NotifyController } from './notify.controller';

@Module({
  controllers: [NotifyController],
  providers: [NotifyService, NotifyRepository],
  imports: [],
})
export class NotifyModule {}
