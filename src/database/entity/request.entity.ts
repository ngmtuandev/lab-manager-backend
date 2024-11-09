import { Entity, Column } from 'typeorm';
import { GenericEntity } from './generic.entity';
@Entity()
export class RequestEntity extends GenericEntity {
  @Column()
  title: string;

  @Column()
  reason: string;

  @Column({ type: 'integer' }) // Chọn kiểu `integer` hoặc `varchar`
  scheduleRequestId: number;

  @Column({ type: 'date' })
  dateCan: Date;

  @Column({ type: 'time' })
  startTimeCan: string;

  @Column({ type: 'time' })
  endTimeCan: string;

  @Column({ type: 'integer' }) // Chọn kiểu `integer` hoặc `varchar`
  labCanId: number;

  @Column({ type: 'integer' }) // Chọn kiểu `integer` hoặc `varchar`
  userId: number;

  @Column({ default: false })
  isAccept: boolean;
}
