import { Module } from '@nestjs/common';
import { LabService } from './lab.service';
import { LabController } from './lab.controller';
import { LabRepository } from 'src/database/repository';

@Module({
  controllers: [LabController],
  providers: [LabService, LabRepository],
  imports: [],
})
export class LabModule {}
