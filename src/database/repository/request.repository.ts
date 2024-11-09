import { RequestEntity } from '../entity';
import { GenericRepository } from './generic.repository';
import { EntityTarget, Repository } from 'typeorm';

export class RequestRepository extends GenericRepository<RequestEntity> {
  protected repository: Repository<RequestEntity>;

  getEntityType(): EntityTarget<RequestEntity> {
    return RequestEntity;
  }

  async findAllByCondition(isAccept: boolean) {
    const requests = await this.repository.find({
      where: {
        isAccept,
      },
    });
    return requests;
  }

  async findOneByCondition(isAccept: boolean, userId: number) {
    const requestOfUser = await this.repository.find({
      where: {
        isAccept,
        userId,
      },
    });
    return requestOfUser;
  }
}
