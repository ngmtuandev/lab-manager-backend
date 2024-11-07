import { Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsUUID, ValidateNested } from 'class-validator';

export class CreateHistoryDto {
    @Expose({ name: 'name' })
    @IsNotEmpty()
    name: string;


}
