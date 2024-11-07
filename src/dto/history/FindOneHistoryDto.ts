import { IsOptional, IsInt } from 'class-validator';

export class FindOneHistoryDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  day?: number;

  @IsOptional()
  @IsInt()
  month?: number;
}
