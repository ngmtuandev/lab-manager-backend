import { Entity, Column } from 'typeorm';
import { GenericEntity } from './generic.entity';
@Entity()
export class NotifyEntity extends GenericEntity {
  @Column()
  userId: number;

  @Column()
  title: string;

  @Column()
  isRead: boolean;
}
