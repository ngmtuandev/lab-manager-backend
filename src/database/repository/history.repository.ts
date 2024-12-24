import { HistoryEntity, LabEntity } from '../entity';
import { GenericRepository } from './generic.repository';
import { EntityTarget, IsNull, Repository } from 'typeorm';

export class HistoryRepository extends GenericRepository<HistoryEntity> {
  protected repository: Repository<HistoryEntity>;

  getEntityType(): EntityTarget<HistoryEntity> {
    return HistoryEntity;
  }

  async findAll() {
    const result = await this.repository.find({
      order: {
        createdAt: 'DESC', // Sắp xếp theo createdAt giảm dần
      },
      relations: ['lab'],
    });
    return result;
  }

  async findOne(id: number) {
    const lab = await this.repository.findOne({
      where: {
        id,
      },
    });
    return lab;
  }

  async findActiveByLab(lab: LabEntity) {
    const result = await this.repository.findOne({
      where: {
        lab: { id: lab?.id },
        timeCheckout: IsNull(),
      },
      relations: ['lab'],
    });
    return result;
  }

  async findByUser(userId: number, day?: number, month?: number) {
    const queryBuilder = this.repository
      .createQueryBuilder('record')
      .where('record.userId = :userId', { userId })
      .leftJoinAndSelect('record.lab', 'lab');

    if (day) {
      queryBuilder.andWhere('EXTRACT(DAY FROM record.created_at) = :day', {
        day,
      });
    }

    if (month) {
      queryBuilder.andWhere('EXTRACT(MONTH FROM record.created_at) = :month', {
        month,
      });
    }

    queryBuilder.orderBy('record.created_at', 'DESC');

    const result = await queryBuilder.getMany();
    return result;
  }

  async countCheckinsAndCheckoutsByLabAndDateRange(
    labId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return this.repository
      .createQueryBuilder('history')
      .where('history.lab.id = :labId', { labId })
      .andWhere('history.timeCheckin BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getCount();
  }

  // Phương thức để lấy chi tiết lượt vào/ra cho một phòng trong khoảng thời gian
  async findDetailsByLabAndDateRange(
    labId: number,
    startDate: Date,
    endDate: Date,
    userId?: number,
  ): Promise<HistoryEntity[]> {
    const query = this.repository
      .createQueryBuilder('history')
      .where('history.lab.id = :labId', { labId })
      .andWhere('history.timeCheckin BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .leftJoinAndSelect('history.user', 'user');
    // Chỉ thêm điều kiện where userId khi có truyền userId
    if (userId) {
      query.andWhere('history.userId = :userId', { userId });
    }
    return query.getMany();
  }
  async findTeacherCheckinCheckoutDetails(
    teacherId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<HistoryEntity[]> {
    return this.repository
      .createQueryBuilder('history')
      .where('history.userId = :teacherId', { teacherId })
      .andWhere('history.timeCheckin BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .leftJoinAndSelect('history.lab', 'lab') // Include lab details
      .getMany();
  }

  async getLabCheckinCounts(startDate: Date, endDate: Date) {
    return this.repository
      .createQueryBuilder('history')
      .select([
        'lab.id as "labId"',
        'lab.nameLab as "labName"',
        'COUNT(history.id) as "checkinCount"',
      ])
      .leftJoin('history.lab', 'lab')
      .where('history.timeCheckin BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('lab.id')
      .addGroupBy('lab.nameLab')
      .getRawMany();
  }
}
