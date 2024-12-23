import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { cloudinary } from 'src/config/cloudinary.config';
import { UserRepository } from 'src/database/repository';
import { LoginDto } from 'src/dto';
import { Readable } from 'stream';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(infoLogin: LoginDto) {
    const findUser = await this.userRepository.findByUserName(
      infoLogin?.userName,
    );

    if (findUser && infoLogin.password == findUser.password) {
      return findUser;
    } else {
      return false;
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      // Tạo một stream upload từ buffer
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' }, // Tự động nhận diện loại file (image, video, etc.)
        (error, result) => {
          if (error) {
            reject(new Error('Upload failed: ' + error.message));
          }
          resolve(result?.secure_url); // Trả về URL ảnh sau khi upload thành công
        },
      );

      stream.end(file.buffer); // Đảm bảo stream nhận đúng buffer từ Multer
    });
  }
}
