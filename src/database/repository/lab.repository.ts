import { LabEntity } from '../entity';
import { GenericRepository } from './generic.repository';
import { EntityTarget, Repository } from 'typeorm';

export class LabRepository extends GenericRepository<LabEntity> {
  protected repository: Repository<LabEntity>;

  getEntityType(): EntityTarget<LabEntity> {
    return LabEntity;
  }

  async findOne(id: number) {
    const lab = await this.repository.findOne({
      where: {
        id,
      },
    });
    return lab;
  }

  async findLabsInUse(): Promise<LabEntity[]> {
    return this.repository.find({
      where: {
        isDoingUse: true,
      },
    });
  }

  async findAll() {
    const result = await this.repository.find({
      order: {
        createdAt: 'ASC', // Sắp xếp theo createdAt giảm dần
      },
    });
    return result;
  }

  // Phương thức để lấy lịch sử dụng phòng trong khoảng thời gian
  async getScheduledDatesInRange(
    labId: number,
    startDate: Date,
    endDate: Date,
  ) {
    return this.repository
      .createQueryBuilder('lab')
      .innerJoinAndSelect('lab.schedules', 'schedule')
      .where('lab.id = :labId', { labId })
      .andWhere('schedule.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();
  }

  // Phương thức để tìm các ngày phòng trống trong khoảng thời gian
  async getAvailableDatesInRange(
    labId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Date[]> {
    // Lấy các ngày đã có lịch trong khoảng thời gian
    const scheduledDates = await this.repository
      .createQueryBuilder('lab')
      .innerJoin('lab.schedules', 'schedule')
      .select('schedule.date', 'date')
      .where('lab.id = :labId', { labId })
      .andWhere('schedule.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawMany();

    const scheduledDatesSet = new Set(
      scheduledDates.map((d) => d.date.toISOString().split('T')[0]),
    );

    // Tạo danh sách tất cả các ngày trong khoảng thời gian
    const availableDates = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split('T')[0];
      if (!scheduledDatesSet.has(dateStr)) {
        availableDates.push(new Date(dateStr));
      }
    }

    return availableDates;
  }

  async getScheduledDatesInRangeNew(
    labId: number,
    startDate: Date,
    endDate: Date,
  ) {
    return this.repository
      .createQueryBuilder('lab')
      .innerJoinAndSelect('lab.schedules', 'schedule')
      .where('lab.id = :labId', { labId })
      .andWhere('schedule.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();
  }

  async getAvailableDatesInRangeNew(
    labId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Date[]> {
    console.log('Input dates:', { startDate, endDate });

    const query = this.repository
      .createQueryBuilder('lab')
      .innerJoin('lab.schedules', 'schedule')
      .select('schedule.date', 'date')
      .where('lab.id = :labId', { labId })
      .andWhere('schedule.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    console.log('Raw query:', query.getQuery());

    const scheduledDates = await query.getRawMany();
    console.log('Raw scheduled dates:', scheduledDates);

    // Tạo Set chứa các ngày đã lên lịch
    const scheduledDatesSet = new Set(
      scheduledDates.map((d) => {
        // Xử lý date object
        const date = new Date(d.date);
        return date.toISOString().split('T')[0];
      }),
    );

    console.log('Scheduled dates set:', scheduledDatesSet);

    // Tạo danh sách tất cả các ngày trong khoảng thời gian
    const availableDates: string[] = [];
    const currentDate = new Date(startDate);
    const endDateTime = new Date(endDate);

    while (currentDate <= endDateTime) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (!scheduledDatesSet.has(dateStr)) {
        availableDates.push(dateStr);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log('Final available dates:', availableDates);
    return availableDates.map((dateStr) => new Date(dateStr));
  }

  async getAllLabsStatusWithSchedules(
    startDate: Date,
    endDate: Date,
  ): Promise<LabEntity[]> {
    return this.repository
      .createQueryBuilder('lab')
      .leftJoinAndSelect(
        'lab.schedules',
        'schedule',
        'schedule.date BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      )
      .leftJoinAndSelect(
        'lab.histories',
        'history',
        'history.timeCheckout IS NULL', // Only get active histories (not checked out)
      )
      .getMany();
  }
}
