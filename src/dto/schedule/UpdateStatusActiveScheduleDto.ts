import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class UpdateStatusActiveScheduleDto {
  @IsNotEmpty()
  scheduleId: any;

  @IsNotEmpty()
  isActive: boolean;
}
