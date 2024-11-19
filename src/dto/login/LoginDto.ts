import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @Expose({ name: 'phoneNumber' })
  @IsNotEmpty()
  phoneNumber: any;

  @Expose({ name: 'password' })
  @IsNotEmpty()
  password: string;
}
