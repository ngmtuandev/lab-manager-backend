import { UserEntity } from '../entity';
import { GenericRepository } from './generic.repository';
import { EntityTarget, Repository } from 'typeorm';

export class UserRepository extends GenericRepository<UserEntity> {
  protected repository: Repository<UserEntity>;

  getEntityType(): EntityTarget<UserEntity> {
    return UserEntity;
  }

  async findOne(id: number) {
    const lab = await this.repository.findOne({
      where: {
        id,
      },
    });
    return lab;
  }

  async findByUserName(userName: string) {
    const lab = await this.repository.findOne({
      where: {
        userName,
      },
    });
    return lab;
  }

  async findAll() {
    const result = await this.repository.find({ relations: ['lab'] });
    return result;
  }
}
