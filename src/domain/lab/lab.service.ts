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

  async updateStatusUseLab(id: any) {
    const labUpdate = await this.labRepository.findOne(id?.id);
    labUpdate.isDoingUse = false;
    this.labRepository.save(labUpdate);
    return true;
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

  async getLabsByStatusAndSchedule(startDate: Date, endDate: Date) {
    // Lấy tất cả các phòng
    const labs = await this.labRepository.findAll();

    // Lấy danh sách phòng và trạng thái của chúng theo khoảng thời gian
    const results = await Promise.all(
      labs.map(async (lab) => {
        const scheduledDates =
          await this.labRepository.getScheduledDatesInRangeNew(
            lab.id,
            startDate,
            endDate,
          );

        const availableDates =
          await this.labRepository.getAvailableDatesInRangeNew(
            lab.id,
            startDate,
            endDate,
          );

        let status = 'available';

        if (lab.isDoingUse) {
          status = 'in-use';
        } else if (scheduledDates.length > 0) {
          status = 'scheduled';
        }

        return {
          labId: lab.id,
          name: lab.nameLab,
          status,
          scheduledDates,
          availableDates,
        };
      }),
    );

    return results;
  }

  async getAllLabsStatus(startDate: Date, endDate: Date) {
    return this.labRepository.getAllLabsStatusWithSchedules(startDate, endDate);
  }
}
