import { EntityTarget, Repository } from 'typeorm';
import { ScheduleEntity } from '../entity';
import { GenericRepository } from './generic.repository';

export class ScheduleRepository extends GenericRepository<ScheduleEntity> {
  protected repository: Repository<ScheduleEntity>;

  getEntityType(): EntityTarget<ScheduleEntity> {
    return ScheduleEntity;
  }

  async findOne(scheduleId: number): Promise<ScheduleEntity | null> {
    return this.repository.findOne({
      where: { id: scheduleId },
      relations: ['teacher', 'room'],
    });
  }

  async findScheduleForCheckin(
    teacherId: number,
    labId: number,
    date: string,
    currentTime: string,
  ): Promise<ScheduleEntity | null> {
    const startTimeWithBuffer = new Date(`${date}T${currentTime}`);
    startTimeWithBuffer.setMinutes(startTimeWithBuffer.getMinutes() - 5); // Lùi 5 phút

    return this.repository
      .createQueryBuilder('schedule')
      .where('schedule.teacher.id = :teacherId', { teacherId })
      .andWhere('schedule.room.id = :labId', { labId })
      .andWhere('schedule.date = :date', { date })
      .andWhere('schedule.startTime <= :currentTime', { currentTime })
      .andWhere('schedule.endTime >= :currentTime', { currentTime })
      .getOne();
  }

  async findScheduleForCheckout(
    teacherId: number,
    labId: number,
    date: string,
    currentTime: string,
  ): Promise<ScheduleEntity | null> {
    return this.repository
      .createQueryBuilder('schedule')
      .where('schedule.teacher.id = :teacherId', { teacherId })
      .andWhere('schedule.room.id = :labId', { labId })
      .andWhere('schedule.date = :date', { date })
      .andWhere('schedule.startTime <= :currentTime', { currentTime })
      .andWhere(
        'schedule.endTime >= :currentTime OR :currentTime >= schedule.endTime',
        { currentTime },
      )
      .getOne();
  }

  async findConflictingSchedules(
    labId: number,
    date: Date,
    startTime: string,
    endTime: string,
  ): Promise<ScheduleEntity[]> {
    return this.repository
      .createQueryBuilder('schedule')
      .where('schedule.room.id = :labId', { labId })
      .andWhere('schedule.date = :date', { date })
      .andWhere(
        '(schedule.startTime < :endTime AND schedule.endTime > :startTime)',
        { startTime, endTime },
      )
      .getMany();
  }

  async findByTeacher(idTeacher: any) {
    const result = await this.repository.find({
      where: { teacher: { id: idTeacher } },
      relations: ['teacher', 'room'],
    });
    return result;
  }

  // Phương thức cho CHECKIN - tìm theo teacherId, labId, date và startTime
  async findByTeacherLabDateAndStartTime(
    teacherId: number,
    labId: number,
    date: string,
    startTime: string,
  ): Promise<ScheduleEntity | null> {
    const dateObj = new Date(date);

    return this.repository.findOne({
      where: {
        teacher: { id: teacherId },
        room: { id: labId },
        date: dateObj,
        startTime,
      },
      relations: ['teacher', 'room'],
    });
  }

  // Phương thức cho CHECKOUT - tìm theo teacherId, labId, date và endTime
  async findByTeacherLabDateAndEndTime(
    teacherId: number,
    labId: number,
    date: string,
    endTime: string,
  ): Promise<ScheduleEntity | null> {
    const dateObj = new Date(date);

    return this.repository.findOne({
      where: {
        teacher: { id: teacherId },
        room: { id: labId },
        date: dateObj,
        endTime,
      },
      relations: ['teacher', 'room'],
    });
  }

  // Tìm các lịch dạy của giáo viên trong khoảng thời gian xác định
  async findSchedulesByTeacherAndDateRange(
    teacherId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<ScheduleEntity[]> {
    return this.repository
      .createQueryBuilder('schedule')
      .where('schedule.teacher.id = :teacherId', { teacherId })
      .andWhere('schedule.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .leftJoinAndSelect('schedule.room', 'room') // Lấy thông tin phòng học
      .leftJoinAndSelect('schedule.teacher', 'teacher') // Lấy thông tin giáo viên
      .getMany();
  }
}
