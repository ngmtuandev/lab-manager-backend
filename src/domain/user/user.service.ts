import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/database/entity';
import {
  LabRepository,
  ScheduleRepository,
  UserRepository,
} from 'src/database/repository';
import * as zlib from 'zlib';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly labRepository: LabRepository,
    private readonly scheduleRepository: ScheduleRepository,
    private readonly authService: AuthService,
  ) {}

  async create(createInfo: any, files: any) {
    // const labEntity = await this.labRepository.findOne(+createInfo?.lab);

    const userEntity = new UserEntity();

    userEntity.userName = createInfo.userName;
    userEntity.isActive = true;
    userEntity.email = createInfo.email;
    userEntity.role = createInfo.role;
    userEntity.phoneNumber = createInfo.phoneNumber;
    userEntity.password = createInfo.password;

    const imageUrls = await Promise.all(
      files.map((file: any) => this.authService.uploadImage(file)),
    );

    userEntity.images = imageUrls;

    try {
      const result = await this.userRepository.save(userEntity);
      return result;
    } catch (error) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: error,
      };
    }
  }

  async findOne(id: any) {
    const result = await this.userRepository.findOne(id?.id);
    return result;
  }

  async findAll() {
    const result = await this.userRepository.findAll();
    return result;
  }

  async getTeacherSchedulesInRange(
    teacherId: number,
    startDate: string,
    endDate: string,
    isActive: boolean,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const teacher = await this.userRepository.findOne(teacherId);
    if (!teacher) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: 'Giáo viên không tồn tại',
      };
    }

    return this.scheduleRepository.findSchedulesByTeacherAndDateRange(
      teacherId,
      isActive,
      start,
      end,
    );
  }

  async updateDetectFaceImage(id: any, images: any) {
    try {
      const user = await this.userRepository.findOne(id);
      user.images = images;
      await this.userRepository.save(user);
      return true;
    } catch (error) {
      return false;
    }
  }
}
