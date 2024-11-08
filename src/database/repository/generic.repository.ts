import { GenericEntity } from '../entity/generic.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  EntityTarget,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Like,
  Repository,
} from 'typeorm';

export abstract class GenericRepository<E extends GenericEntity> {
  protected repository: Repository<E>;

  protected entityManager: EntityManager;

  constructor(
    @InjectDataSource() protected xDs: DataSource,
    protected dataSource: DataSource,
  ) {
    this.repository = xDs.getRepository(this.getEntityType());
    this.entityManager = xDs.manager;
  }

  /**
   * @param entity E
   * @returns
   */
  hasEntity(entity: E): boolean {
    let yes = false;
    if (this.repository != undefined) {
      yes = this.repository.hasId(entity);
    }
    return yes;
  }

  /**
   * @param fieldName any (string, ...)
   * @returns Entity
   */
  async findOneByFieldName(fieldName: any): Promise<E> {
    return await this.repository.findOne({
      where: { ...fieldName },
    } as FindOneOptions<E>);
  }

  /**
   * Find items by any 'where' conditions
   * @param relations   -> relationship
   * @param where       -> condition
   * @param order       -> order by
   * @returns           -> item list
   */
  findBy(relations?: string[], where?: any, order?: any): Promise<E[]> {
    if (this.repository != undefined) {
      return this.repository.find({ relations, where, order });
    }
    return undefined;
  }

  /**
   * @param entity E
   * @returns Entity
   */
  save(entity?: E): Promise<E> {
    return this.repository.save(entity);
  }

  /**
   * @param entities E[]
   * @returns Entity[]
   */
  saveMulti(entities: E[]): Promise<E[]> {
    return this.repository.save(entities);
  }

  /**
   * Delete item
   */
  delete(id: number): Promise<boolean> {
    if (this.repository != undefined) {
      const retValue = this.repository
        .delete(id)
        .then((v) => {
          if (v.affected == null || v.affected == undefined) return undefined;
        })
        .catch(() => this.repository?.delete(id));
      if (retValue != undefined) {
        return Promise.resolve(true);
      }
    }
    return Promise.resolve(false);
  }

  abstract getEntityType(): EntityTarget<E>;
}
