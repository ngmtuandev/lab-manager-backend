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
    scheduleId: any,
  ): Promise<ScheduleEntity | null> {
    console.log('🚀 ~ ScheduleRepository ~ date:', date);
    console.log('currentTime (Check-in time requested):', currentTime);

    const dateObj = new Date(date);

    // Fetch the schedule entity to get the scheduled start and end times
    const schedule = await this.repository.findOne({
      where: {
        id: scheduleId,
        teacher: { id: teacherId },
        room: { id: labId },
        date: dateObj,
      },
      relations: ['teacher', 'room'],
    });
    console.log('🚀 ~ ScheduleRepository ~ schedule:', schedule);

    if (!schedule) {
      throw new Error(
        'No schedule found for the provided teacher, lab, and date.',
      );
    }

    const scheduledStartTime = schedule.startTime; // Format: "HH:mm"
    const scheduledEndTime = schedule.endTime; // Format: "HH:mm"
    console.log('Scheduled Start Time:', scheduledStartTime);
    console.log('Scheduled End Time:', scheduledEndTime);

    // Calculate the earliest allowed check-in time
    const [hours, minutes] = scheduledStartTime.split(':').map(Number);
    let earliestCheckinMinutes = minutes - 5;
    let earliestCheckinHours = hours;

    if (earliestCheckinMinutes < 0) {
      earliestCheckinMinutes += 60;
      earliestCheckinHours -= 1;
    }

    const earliestAllowedCheckinTime = `${String(earliestCheckinHours).padStart(2, '0')}:${String(earliestCheckinMinutes).padStart(2, '0')}`;
    console.log('Earliest Allowed Check-in Time:', earliestAllowedCheckinTime);

    // Check if the currentTime is within the allowed check-in range
    if (
      currentTime >= earliestAllowedCheckinTime &&
      currentTime <= scheduledEndTime
    ) {
      return schedule;
    } else {
      return null; // Return null if the check-in time is outside the allowed range
    }
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
    isActive: boolean,
    startDate: Date,
    endDate: Date,
  ): Promise<ScheduleEntity[]> {
    return this.repository
      .createQueryBuilder('schedule')
      .where('schedule.teacher.id = :teacherId', { teacherId })
      .andWhere('schedule.isActive = :isActive', { isActive })
      .andWhere('schedule.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .leftJoinAndSelect('schedule.room', 'room') // Lấy thông tin phòng học
      .leftJoinAndSelect('schedule.teacher', 'teacher') // Lấy thông tin giáo viên
      .getMany();
  }
}
