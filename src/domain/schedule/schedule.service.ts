import { Injectable, BadRequestException } from '@nestjs/common';
import { ScheduleRepository } from 'src/database/repository/schedule.repository';
import { LabRepository } from 'src/database/repository/lab.repository';
import { UserRepository } from 'src/database/repository/user.repository';
import { ScheduleEntity } from 'src/database/entity/schedule.entity';
import { UpdateStatusActiveScheduleDto } from 'src/dto';
import { MailService } from '../mailer/MailService';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly labRepository: LabRepository,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
  ) {}

  async createSchedule(scheduleData: {
    teacherId: number;
    labId: number;
    date: Date;
    startTime: string;
    endTime: string;
    name: string;
  }) {
    const { teacherId, labId, date, startTime, endTime, name } = scheduleData;

    // Kiểm tra xem phòng có tồn tại không
    const lab = await this.labRepository.findOne(labId);
    if (!lab) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: 'Phòng không tồn tại',
      };
    }

    // Kiểm tra xem giáo viên có tồn tại không
    const teacher = await this.userRepository.findOne(teacherId);
    if (!teacher) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: 'Giáo viên không tồn tại',
      };
    }

    // Kiểm tra xung đột lịch
    const conflictingSchedules =
      await this.scheduleRepository.findConflictingSchedules(
        labId,
        date,
        startTime,
        endTime,
      );

    if (conflictingSchedules.length > 0) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: 'Phòng đã có lịch dạy vào thời gian này',
      };
    }

    const result = await this.mailService.sendMail(
      teacher.email,
      `New Schedule for You at ${startTime} and room: ${lab.nameLab}`,
      `
      User: ${teacher?.email}
      Date: ${date}
      Time Start: ${startTime}
      Time End: ${endTime}
      Room: ${lab?.nameLab}
      ** Please remember your schedule and don't checkin late. Thankyou !! **
      `,
    );

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

  // Disiable Schedule because request of teacher
  async updateStatusActiveSchedule(dataUpdate: UpdateStatusActiveScheduleDto) {
    const findScheduleExist = await this.scheduleRepository.findOne(
      dataUpdate?.scheduleId,
    );
    if (findScheduleExist) {
      findScheduleExist.isActive = dataUpdate?.isActive;

      try {
        await this.scheduleRepository.save(findScheduleExist);
        return {
          status: 'SUCCESS',
          isSuccess: true,
          data: null,
          message: dataUpdate?.isActive
            ? 'Kích hoạt ca dạy thành công'
            : 'Xóa ca dạy thành công',
        };
      } catch (error) {
        return {
          status: 'FAIL',
          isSuccess: false,
          data: null,
          message: 'Cập nhập ca dạy thất bại',
        };
      }
    }
  }

  // tìm theo giáo viên và ngày
  async getSchedulesByTeacherAndDate(
    teacherId: number,
    date: Date,
  ): Promise<ScheduleEntity[]> {
    return this.scheduleRepository.findByTeacherAndDate(teacherId, date);
  }

  // thống báo lịch dạy cho giáo viên
  async notifyScheduleForTeacher(teacherId: any, start: any, end: any) {
    try {
      const emailTeacher = (await this.userRepository.findOne(teacherId)).email;
      const result =
        await this.scheduleRepository.findSchedulesByTeacherAndDateRange(
          teacherId,
          true,
          start,
          end,
        );
      const tableHtml = `
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Ngày</th>
            <th>Giờ Bắt Đầu</th>
            <th>Giờ Kết Thúc</th>
            <th>Phòng</th>
            <th>Giáo Viên</th>
          </tr>
        </thead>
        <tbody>
          ${result
            .map(
              (item) => `
            <tr>
              <td>${item.id}</td>
              <td>${item.name}</td>
              <td>${item.date}</td>
              <td>${item.startTime}</td>
              <td>${item.endTime}</td>
              <td>${item.room.nameLab}</td>
              <td>${item.teacher.userName} (${item.teacher.email})</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    `;
      await this.mailService.sendMail(
        emailTeacher,
        `** Schedule of you from ${start} to ${end}`,
        'Please dont reply this email',
        tableHtml,
      );
      return {
        status: 'SUCCESS',
        isSuccess: true,
        message: 'Notify for user throught email successfully',
      };
    } catch (error) {
      return {
        status: 'FAIL',
        isSuccess: false,
        message: 'Notify for user throught email failure',
      };
    }
  }
}
