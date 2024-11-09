import { IsNotEmpty } from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  reason: string;

  @IsNotEmpty()
  scheduleRequestId: number;

  @IsNotEmpty()
  dateCan: any;

  @IsNotEmpty()
  endTimeCan: any;

  @IsNotEmpty()
  startTimeCan: any;

  @IsNotEmpty()
  labCanId: number;

  @IsNotEmpty()
  userId: number;
}
