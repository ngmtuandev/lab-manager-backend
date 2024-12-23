import { BadRequestException, Injectable } from '@nestjs/common';
import { LabEntity } from 'src/database/entity';
import { LabRepository } from 'src/database/repository';
import { NotifyRepository } from 'src/database/repository/notify.repository';
import { CreateLabDto } from 'src/dto';

@Injectable()
export class NotifyService {
  constructor(private readonly notifyRepository: NotifyRepository) {}

  async createNotify(notifyRequest: any) {
    const notify = await this.notifyRepository.createNotify({
      ...notifyRequest,
      isRead: false,
    });
    return notify;
  }

  async getAndMarkAsRead(userId: number) {
    const notify = await this.notifyRepository.getAndMarkAsRead(userId);
    return notify;
  }
}
