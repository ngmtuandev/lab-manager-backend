import { Injectable, BadRequestException } from '@nestjs/common';
import { ScheduleRepository } from 'src/database/repository/schedule.repository';
import { LabRepository } from 'src/database/repository/lab.repository';
import { UserRepository } from 'src/database/repository/user.repository';
import { ScheduleEntity } from 'src/database/entity/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly labRepository: LabRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createSchedule(scheduleData: {
    teacherId: number;
    labId: number;
    date: Date;
    startTime: string;
    endTime: string;
    name: string;
  }): Promise<ScheduleEntity> {
    const { teacherId, labId, date, startTime, endTime, name } = scheduleData;

    // Kiểm tra xem phòng có tồn tại không
    const lab = await this.labRepository.findOne(labId);
    if (!lab) {
      throw new BadRequestException('Phòng không tồn tại');
    }

    // Kiểm tra xem giáo viên có tồn tại không
    const teacher = await this.userRepository.findOne(teacherId);
    if (!teacher) {
      throw new BadRequestException('Giáo viên không tồn tại');
    }

    // Kiểm tra xung đột lịch
    const conflictingSchedules =
      await this.scheduleRepository.findConflictingSchedules(
        labId,
        date,
        startTime,
        endTime,
      );
    console.log(
      '🚀 ~ ScheduleService ~ conflictingSchedules:',
      conflictingSchedules,
    );

    if (conflictingSchedules.length > 0) {
      throw new BadRequestException('Phòng đã có lịch dạy vào thời gian này');
    }

    // Tạo lịch mới nếu không có xung đột
    const newSchedule = new ScheduleEntity();
    newSchedule.name = name;
    newSchedule.startTime = startTime;
    newSchedule.room = lab;
    newSchedule.date = date;
    newSchedule.endTime = endTime;
    newSchedule.isActive = true;
    newSchedule.teacher = teacher;

    return this.scheduleRepository.save(newSchedule);
  }

  // Find by teacher
  async getSchedulesByTeacher(teacherId: number): Promise<ScheduleEntity[]> {
    return this.scheduleRepository.findByTeacher(teacherId);
  }
}
