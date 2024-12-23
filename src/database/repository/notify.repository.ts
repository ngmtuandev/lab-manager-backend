import { EntityTarget, Repository } from 'typeorm';
import { NotifyEntity } from '../entity';
import { GenericRepository } from './generic.repository';

export class NotifyRepository extends GenericRepository<NotifyEntity> {
  protected repository: Repository<NotifyEntity>;

  getEntityType(): EntityTarget<NotifyEntity> {
    return NotifyEntity;
  }

  async createNotify(notifyRequest: any) {
    const notify = this.repository.create(notifyRequest);
    await this.repository.save(notify);
    return notify;
  }

  async getAndMarkAsRead(userId: number) {
    const notifications = await this.repository.find({
      where: { userId: userId, isRead: false },
    });
    // Sau đó update status đã đọc
    await this.repository.update(
      { userId: userId }, // Thêm điều kiện where
      { isRead: true },
    );
    return notifications;
  }
}
