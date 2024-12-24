import { Injectable, BadRequestException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HistoryEntity } from 'src/database/entity';
import {
  HistoryRepository,
  LabRepository,
  UserRepository,
  ScheduleRepository,
} from 'src/database/repository';
import addMinutes from 'src/helper/addMinus';
import getCurrentDate from 'src/helper/getCurrentDate';
import getCurrentTime from 'src/helper/getCurrentTime';

@Injectable()
export class HistoryService {
  constructor(
    private readonly historyRepository: HistoryRepository,
    private readonly userRepository: UserRepository,
    private readonly labRepository: LabRepository,
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  // @Cron(CronExpression.EVERY_5_MINUTES) // Job sẽ chạy 10 giây
  // async handleCron() {
  //   const findLabInUse = await this.labRepository.findLabsInUse();
  //   findLabInUse?.map(async (item: any) => {
  //     const labFind = await this.labRepository.findOne(item.id);
  //     labFind.isDoingUse = false;
  //     this.labRepository.save(labFind);
  //   });
  // }

  async createCheckin(createInfo: any) {
    const labEntity = await this.labRepository.findOne(+createInfo?.lab);
    const userEntity = await this.userRepository.findOne(+createInfo?.user);

    if (labEntity?.isDoingUse) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: 'Phòng đang trong ca dạy',
      };
    }

    if (!labEntity || !userEntity) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: 'Phòng học hoặc giáo viên không tồn tại',
      };
    }

    const currentDateString = createInfo.date;
    const currentTime = createInfo.time;

    // Find a valid schedule for check-in
    const schedule = await this.scheduleRepository.findScheduleForCheckin(
      userEntity.id,
      labEntity.id,
      currentDateString,
      currentTime,
      createInfo?.scheduleId,
    );

    if (!schedule) {
      const findScheduleConflictNextTime =
        await this.scheduleRepository.findConflictingSchedules(
          labEntity?.id,
          currentDateString,
          currentTime,
          addMinutes(currentTime, 20),
        );

      if (findScheduleConflictNextTime?.length > 0) {
        return {
          status: 'FAIL',
          isSuccess: false,
          data: null,
          message: 'Phòng này hiện tại/ sắp tới đã có lịch dạy',
        };
      } else {
        const checkinTime = new Date(`${currentDateString}T${currentTime}`);

        const historyEntity = new HistoryEntity();
        console.log('Khởi tạo HistoryEntity thành công');
        historyEntity.lab = labEntity;
        historyEntity.userEmail = userEntity.email;
        historyEntity.phoneNumber = userEntity.phoneNumber;
        historyEntity.user = userEntity;
        historyEntity.userName = userEntity.userName;
        historyEntity.userId = userEntity.id;
        historyEntity.timeCheckin = checkinTime;
        historyEntity.hasCheckedIn = true;
        historyEntity.isLateCheckin = false;
        historyEntity.lateCheckinMinutes = null;
        historyEntity.isCorrect = false;

        labEntity.isDoingUse = true;

        try {
          await this.labRepository.save(labEntity);
        } catch (error) {
          throw error;
        }
        console.log('kết thúc lưu');
        try {
          const result = await this.historyRepository.save(historyEntity);
          return {
            status: 'SUCCESS',
            isSuccess: true,
            data: result,
          };
        } catch (error) {
          return {
            status: 'FAIL',
            isSuccess: false,
            data: null,
            message: 'Tạo lịch sử checkin lỗi',
          };
        }
      }
    }

    const scheduleStartTime = new Date(
      `${currentDateString}T${schedule.startTime}`,
    );

    const checkinTime = new Date(`${currentDateString}T${currentTime}`);

    // Calculate the difference in minutes between check-in and scheduled start time
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
    historyEntity.scheduleId = schedule.id;
    historyEntity.isCorrect = true;

    // Mark late check-in if check-in occurs after the scheduled start time
    if (diffInMinutes > 0) {
      historyEntity.isLateCheckin = true;
      historyEntity.lateCheckinMinutes = Math.round(diffInMinutes);
    } else {
      historyEntity.isLateCheckin = false;
      historyEntity.lateCheckinMinutes = null;
    }

    labEntity.isDoingUse = true;
    schedule.hasCheckedIn = true;
    await this.scheduleRepository.save(schedule);
    await this.labRepository.save(labEntity);

    try {
      const result = await this.historyRepository.save(historyEntity);
      return {
        status: 'SUCCESS',
        isSuccess: true,
        data: result,
      };
    } catch (error) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: 'Tạo lịch sử checkin lỗi',
      };
    }
  }

  async getLabCheckinCounts(startDate: Date, endDate: Date) {
    const counts = await this.historyRepository.getLabCheckinCounts(
      startDate,
      endDate,
    );
    return counts.map((count) => ({
      labId: count.labId,
      labName: count.labName,
      checkinCount: parseInt(count.checkinCount),
    }));
  }

  async createCheckout(createCheckout: any) {
    const labEntity = await this.labRepository.findOne(+createCheckout?.lab);
    const userEntity = await this.userRepository.findOne(+createCheckout?.user);

    if (!labEntity || !userEntity) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: 'Phòng học hoặc giáo viên không tồn tại',
      };
    }

    const currentDateString = createCheckout.date;
    const currentTime = createCheckout.time;

    // Kiểm tra xem người dùng đã `checkin` chưa và lấy `scheduleId` từ `historyCurrent`
    const historyCurrent = await this.historyRepository.findOne(
      createCheckout?.history,
    );
    if (!historyCurrent || !historyCurrent.hasCheckedIn) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: 'Không có lịch sử checkin hợp lệ để checkout',
      };
    }

    // Tìm `schedule` hợp lệ cho checkout theo `scheduleId`
    const schedule = await this.scheduleRepository.findOne(
      historyCurrent.scheduleId,
    );
    if (!schedule) {
      // Không có trong schedule: trường hợp ngoại lệ
      labEntity.isDoingUse = false;
      await this.labRepository.save(labEntity);

      historyCurrent.isEarlyCheckout = false;
      historyCurrent.earlyCheckoutMinutes = null;

      const checkoutTime = new Date(`${currentDateString}T${currentTime}`);
      historyCurrent.timeCheckout = checkoutTime;

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
      schedule.isActive = false;
      await this.scheduleRepository.save(schedule);
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
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: 'Không thể cập nhập thời gian checkout',
      };
    }
  }

  async getLabCheckinCheckoutCount(
    labId: number,
    startDate: string,
    endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const labEntity = await this.labRepository.findOne(labId);
    if (!labEntity) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: 'Phòng học không tồn tại',
      };
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
    userId?: number,
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
      userId,
    );
  }

  async getTeacherCheckinCheckoutDetails(
    teacherId: number,
    startDate: string,
    endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const userEntity = await this.userRepository.findOne(teacherId);
    if (!userEntity) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: 'Giáo viên không tồn tại',
      };
    }

    const records =
      await this.historyRepository.findTeacherCheckinCheckoutDetails(
        teacherId,
        start,
        end,
      );

    const formattedRecords = records.map((record) => ({
      date: record.timeCheckin.toISOString().split('T')[0],
      checkinTime: record.timeCheckin,
      checkoutTime: record.timeCheckout,
      lab: record.lab ? record.lab.nameLab : 'N/A',
      isLateCheckin: record.isLateCheckin,
      lateCheckinMinutes: record.lateCheckinMinutes,
      isEarlyCheckout: record.isEarlyCheckout,
      earlyCheckoutMinutes: record.earlyCheckoutMinutes,
      isCorrect: record?.isCorrect,
    }));

    return {
      status: 'SUCCESS',
      isSuccess: true,
      data: formattedRecords,
    };
  }
}
