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
}
