import { Injectable } from '@nestjs/common';
import { HistoryEntity } from 'src/database/entity';
import {
  HistoryRepository,
  LabRepository,
  UserRepository,
} from 'src/database/repository';

@Injectable()
export class HistoryService {
  constructor(
    private readonly historyRepository: HistoryRepository,
    private readonly userRepository: UserRepository,
    private readonly labRepository: LabRepository,
  ) {}

  async createCheckin(createInfo: any) {
    const labEntity = await this.labRepository.findOne(+createInfo?.lab);
    const userEntity = await this.userRepository.findOne(+createInfo?.user);

    const checkActiveLab = labEntity.isDoingUse;
    if (checkActiveLab) {
      return 'Phòng đang trong ca';
    } else {
      const historyEntity = new HistoryEntity();
      historyEntity.lab = labEntity;
      historyEntity.userEmail = userEntity.email;
      historyEntity.phoneNumber = userEntity.phoneNumber;
      historyEntity.user = userEntity;
      historyEntity.userName = userEntity.userName;
      historyEntity.userId = userEntity.id;
      historyEntity.timeCheckout = null;

      labEntity.isDoingUse = true;
      this.labRepository.save(labEntity);

      try {
        const result = await this.historyRepository.save(historyEntity);
        return result;
      } catch (error) {
        return 'Tạo lịch sử lỗi';
      }
    }
  }

  async createCheckout(createCheckout: any) {
    const labEntity = await this.labRepository.findOne(+createCheckout?.lab);
    labEntity.isDoingUse = false;
    this.labRepository.save(labEntity);
    const historyCurrent = await this.historyRepository.findOne(
      createCheckout?.history,
    );

    historyCurrent.timeCheckout = new Date();

    try {
      const result = await this.historyRepository.save(historyCurrent);
      return result;
    } catch (error) {
      console.error('Error while updating history:', error);
      throw new Error('Không thể cập nhật thời gian checkout');
    }
  }

  async findAll() {
    const result = await this.historyRepository.findAll();
    return result;
  }

  async findByUser(userId: any, day: any, month: any) {
    console.log('🚀 ~ HistoryService ~ findByUser ~ userId:', userId);
    const result = await this.historyRepository.findByUser(userId, day, month);
    return result;
  }

  async findActiveByLab(labId: any) {
    console.log('labbb ', labId);
    const lab = await this.labRepository.findOne(labId);
    console.log('lab find : ', lab);
    const result = await this.historyRepository.findActiveByLab(lab);
    return result;
  }
}
