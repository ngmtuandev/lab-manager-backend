import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginInfo: LoginDto) {
    try {
      const result = await this.authService.login(loginInfo);
      if (result) {
        return {
          status: 'SUCCESS',
          isSuccess: true,
          data: result,
        };
      } else {
        return {
          status: 'FAIL',
          isSuccess: false,
        };
      }
    } catch (error) {
      return {
        status: 'FAIL',
        isSuccess: false,
      };
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return {
        status: 'FAIL',
        isSuccess: false,
        message: 'not find image',
      };
    } else {
      try {
        const url = await this.authService.uploadImage(file);

        return {
          status: 'SUCCESS',
          isSuccess: true,
          data: url,
        };
      } catch (error) {
        return {
          status: 'FAIL',
          isSuccess: false,
        };
      }
    }
  }
}
