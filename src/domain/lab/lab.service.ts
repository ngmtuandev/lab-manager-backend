import { BadRequestException, Injectable } from '@nestjs/common';
import { LabEntity } from 'src/database/entity';
import { LabRepository } from 'src/database/repository';
import { CreateLabDto } from 'src/dto';

@Injectable()
export class LabService {
  constructor(private readonly labRepository: LabRepository) {}

  async create(labInfo: CreateLabDto) {
    const labEntity = new LabEntity();
    labEntity.nameLab = labInfo.nameLab;
    labEntity.isDoingUse = false;
    const result = this.labRepository.save(labEntity);
    return result;
  }

  async findOne(id: any) {
    const lab = await this.labRepository.findOne(id?.id);
    return lab;
  }

  async findAll() {
    const findAll = this.labRepository.findAll();
    return findAll;
  }

  // Lấy lịch sử dụng phòng trong khoảng thời gian
  async getScheduledDatesInRange(
    labId: number,
    startDate: string,
    endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const lab = await this.labRepository.findOne(labId);
    if (!lab) {
      throw new BadRequestException('Phòng không tồn tại');
    }

    return this.labRepository.getScheduledDatesInRange(labId, start, end);
  }

  // Lấy các ngày phòng trống trong khoảng thời gian
  async getAvailableDatesInRange(
    labId: number,
    startDate: string,
    endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const lab = await this.labRepository.findOne(labId);
    if (!lab) {
      throw new BadRequestException('Phòng không tồn tại');
    }

    return this.labRepository.getAvailableDatesInRange(labId, start, end);
  }
}
