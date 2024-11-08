import { Injectable, BadRequestException } from '@nestjs/common';
import { HistoryEntity } from 'src/database/entity';
import {
  HistoryRepository,
  LabRepository,
  UserRepository,
  ScheduleRepository,
} from 'src/database/repository';

@Injectable()
export class HistoryService {
  constructor(
    private readonly historyRepository: HistoryRepository,
    private readonly userRepository: UserRepository,
    private readonly labRepository: LabRepository,
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async createCheckin(createInfo: any) {
    const labEntity = await this.labRepository.findOne(+createInfo?.lab);
    const userEntity = await this.userRepository.findOne(+createInfo?.user);

    if (!labEntity || !userEntity) {
      throw new BadRequestException('Phòng học hoặc giáo viên không tồn tại');
    }

    const currentDateString = createInfo.date;
    const currentTime = createInfo.time;

    // Tìm `schedule` hợp lệ cho checkin
    const schedule = await this.scheduleRepository.findScheduleForCheckin(
      userEntity.id,
      labEntity.id,
      currentDateString,
      currentTime,
    );

    if (!schedule) {
      throw new BadRequestException('Không có lịch dạy hợp lệ để checkin');
    }

    const scheduleStartTime = new Date(
      `${currentDateString}T${schedule.startTime}`,
    );
    const checkinTime = new Date(`${currentDateString}T${currentTime}`);
    const diffInMinutes =
      (checkinTime.getTime() - scheduleStartTime.getTime()) / (1000 * 60);

    const historyEntity = new HistoryEntity();
    historyEntity.lab = labEntity;
    historyEntity.userEmail = userEntity.email;
    historyEntity.phoneNumber = userEntity.phoneNumber;
    historyEntity.user = userEntity;
    historyEntity.userName = userEntity.userName;
    historyEntity.userId = userEntity.id;
    historyEntity.timeCheckin = checkinTime;
    historyEntity.hasCheckedIn = true;
    historyEntity.scheduleId = schedule.id; // Lưu ID của ca làm vào lịch sử checkin

    if (diffInMinutes > 0) {
      historyEntity.isLateCheckin = true;
      historyEntity.lateCheckinMinutes = Math.round(diffInMinutes);
    } else {
      historyEntity.isLateCheckin = false;
      historyEntity.lateCheckinMinutes = null;
    }

    labEntity.isDoingUse = true;
    await this.labRepository.save(labEntity);

    try {
      const result = await this.historyRepository.save(historyEntity);
      return {
        status: 'SUCCESS',
        isSuccess: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException('Tạo lịch sử checkin lỗi');
    }
  }

  async createCheckout(createCheckout: any) {
    const labEntity = await this.labRepository.findOne(+createCheckout?.lab);
    const userEntity = await this.userRepository.findOne(+createCheckout?.user);

    if (!labEntity || !userEntity) {
      throw new BadRequestException('Phòng học hoặc giáo viên không tồn tại');
    }

    const currentDateString = createCheckout.date;
    const currentTime = createCheckout.time;

    // Kiểm tra xem người dùng đã `checkin` chưa và lấy `scheduleId` từ `historyCurrent`
    const historyCurrent = await this.historyRepository.findOne(
      createCheckout?.history,
    );
    if (!historyCurrent || !historyCurrent.hasCheckedIn) {
      throw new BadRequestException(
        'Không có lịch sử checkin hợp lệ để checkout',
      );
    }

    // Tìm `schedule` hợp lệ cho checkout theo `scheduleId`
    const schedule = await this.scheduleRepository.findOne(
      historyCurrent.scheduleId,
    );
    if (!schedule) {
      throw new BadRequestException('Không có lịch dạy hợp lệ để checkout');
    }

    const scheduleEndTime = new Date(
      `${currentDateString}T${schedule.endTime}`,
    );
    const checkoutTime = new Date(`${currentDateString}T${currentTime}`);

    labEntity.isDoingUse = false;
    await this.labRepository.save(labEntity);

    // Tính toán số phút checkout sớm (nếu có)
    const earlyCheckoutMinutes =
      (scheduleEndTime.getTime() - checkoutTime.getTime()) / (1000 * 60);

    if (earlyCheckoutMinutes > 0) {
      historyCurrent.isEarlyCheckout = true;
      historyCurrent.earlyCheckoutMinutes = Math.round(earlyCheckoutMinutes);
    } else {
      historyCurrent.isEarlyCheckout = false;
      historyCurrent.earlyCheckoutMinutes = null;
    }

    historyCurrent.timeCheckout = checkoutTime;

    try {
      const result = await this.historyRepository.save(historyCurrent);
      return {
        status: 'SUCCESS',
        isSuccess: true,
        data: {
          id: result.id,
          lab: labEntity,
          userEmail: result.userEmail,
          phoneNumber: result.phoneNumber,
          userName: result.userName,
          userId: result.userId,
          timeCheckin: result.timeCheckin,
          timeCheckout: result.timeCheckout,
          isEarlyCheckout: result.isEarlyCheckout,
          earlyCheckoutMinutes: result.earlyCheckoutMinutes,
        },
        message: result.isEarlyCheckout
          ? `Bạn đã checkout sớm ${result.earlyCheckoutMinutes} phút.`
          : 'Checkout thành công.',
      };
    } catch (error) {
      throw new BadRequestException('Không thể cập nhật thời gian checkout');
    }
  }

  async getLabCheckinCheckoutCount(
    labId: number,
    startDate: string,
    endDate: string,
  ): Promise<number> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const labEntity = await this.labRepository.findOne(labId);
    if (!labEntity) {
      throw new BadRequestException('Phòng học không tồn tại');
    }

    return this.historyRepository.countCheckinsAndCheckoutsByLabAndDateRange(
      labId,
      start,
      end,
    );
  }

  // Lấy chi tiết lượt checkin/checkout của phòng trong khoảng thời gian
  async getLabCheckinCheckoutDetails(
    labId: number,
    startDate: string,
    endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const labEntity = await this.labRepository.findOne(labId);
    if (!labEntity) {
      throw new BadRequestException('Phòng học không tồn tại');
    }

    return this.historyRepository.findDetailsByLabAndDateRange(
      labId,
      start,
      end,
    );
  }
}
