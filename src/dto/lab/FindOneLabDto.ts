import { Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsUUID, ValidateNested } from 'class-validator';

export class FindOneLabDto {
    @Expose({ name: 'id' })
    @IsNotEmpty()
    id: number;

}
