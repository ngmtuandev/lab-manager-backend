import { Injectable } from '@nestjs/common';
import { RequestEntity } from 'src/database/entity';
import {
  LabRepository,
  RequestRepository,
  UserRepository,
} from 'src/database/repository';
import { CreateRequestDto } from 'src/dto';

@Injectable()
export class RequestService {
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly labRepository: LabRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createNewRequest(dataRequest: CreateRequestDto) {
    try {
      const newRequest = new RequestEntity();
      newRequest.title = dataRequest?.title;
      newRequest.labCanId = dataRequest?.labCanId;
      newRequest.startTimeCan = dataRequest?.startTimeCan;
      newRequest.endTimeCan = dataRequest?.endTimeCan;
      newRequest.reason = dataRequest?.reason;
      newRequest.scheduleRequestId = dataRequest?.scheduleRequestId;
      newRequest.dateCan = dataRequest?.dateCan;
      newRequest.userId = dataRequest?.userId;
      newRequest.isAccept = false;

      await this.requestRepository.save(newRequest);

      return {
        status: 'SUCCESS',
        isSuccess: true,
        data: newRequest,
        message: 'Tạo yêu cầu thành công',
      };
    } catch (error) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: error,
      };
    }
  }

  async findAll(isAccept: boolean) {
    try {
      const result = await this.requestRepository.findAllByCondition(isAccept);
      return {
        status: 'SUCCESS',
        isSuccess: true,
        data: result,
        message: 'Lấy tất cả yêu cầu thành công',
      };
    } catch (error) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: error,
      };
    }
  }

  async findOneByUserId(isAccept: boolean, userId: number) {
    try {
      const result = await this.requestRepository.findOneByCondition(
        isAccept,
        userId,
      );

      const userFind = await this.userRepository.findOne(userId);

      const dataConvert = await Promise.all(
        result?.map(async (item) => {
          const labFind = await this.labRepository.findOne(item?.labCanId);
          // console.log('🚀 ~ RequestService ~ dataConvert ~ labFind:', labFind);
          return {
            ...item,
            labFind: labFind,
            teacher: userFind,
          };
        }),
      );

      return {
        status: 'SUCCESS',
        isSuccess: true,
        data: dataConvert,
        message: 'Lấy tất cả yêu cầu của từng giáo viên thành công',
      };
    } catch (error) {
      return {
        status: 'FAIL',
        isSuccess: false,
        data: null,
        message: error,
      };
    }
  }
}
