import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateLabDto {
    @Expose({ name: 'name_lab' })
    @IsNotEmpty()
    nameLab: string;

}
