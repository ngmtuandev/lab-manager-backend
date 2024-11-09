import { Entity, Column } from 'typeorm';
import { GenericEntity } from './generic.entity';
@Entity()
export class RoleEntity extends GenericEntity {
  @Column()
  name: string;

  @Column()
  isActive: boolean;
}
