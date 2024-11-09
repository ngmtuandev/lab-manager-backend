import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/database/entity';
import {
  LabRepository,
  ScheduleRepository,
  UserRepository,
} from 'src/database/repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly labRepository: LabRepository,
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async create(createInfo: any) {
    // const labEntity = await this.labRepository.findOne(+createInfo?.lab);

    const userEntity = new UserEntity();

    userEntity.userName = createInfo.userName;
    userEntity.isActive = true;
    userEntity.email = createInfo.email;
    userEntity.role = createInfo.role;
    userEntity.phoneNumber = createInfo.phoneNumber;
    userEntity.password = createInfo.password;

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
}
