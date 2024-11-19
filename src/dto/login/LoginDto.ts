import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @Expose({ name: 'userName' })
  @IsNotEmpty()
  userName: string;

  @Expose({ name: 'password' })
  @IsNotEmpty()
  password: string;
}
