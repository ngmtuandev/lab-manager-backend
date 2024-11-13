import { Entity, Column, ManyToOne } from 'typeorm';
import { GenericEntity } from './generic.entity';
import { UserEntity } from './user.entity';
import { LabEntity } from './lab.entity';
import { ScheduleEntity } from './schedule.entity';
@Entity()
export class HistoryEntity extends GenericEntity {
  // @Column()
  // dateOpen: string;

  @Column()
  phoneNumber: string;

  @Column()
  userEmail: string;

  @Column()
  userName: string;

  @Column()
  userId: number;

  @Column('timestamp', {
    name: 'timeCheckin',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  timeCheckin: Date;

  @Column('timestamp', {
    name: 'timeCheckout',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  timeCheckout: Date;

  // TODO: check business
  // @Column()
  // evident: string

  @Column({ type: 'boolean', default: false })
  hasCheckedIn: boolean;

  @Column({ type: 'boolean', default: false })
  isLateCheckin: boolean;

  @Column({ type: 'int', nullable: true })
  lateCheckinMinutes?: number;

  @Column({ type: 'boolean', default: false })
  isEarlyCheckout: boolean;

  @Column({ type: 'int', nullable: true })
  earlyCheckoutMinutes?: number;

  // Thêm trường scheduleId và liên kết với ScheduleEntity
  @Column({ nullable: true })
  scheduleId: number;

  @Column({ default: true })
  isCorrect: boolean;

  @ManyToOne(() => ScheduleEntity, (schedule) => schedule.histories, {
    nullable: true,
  })
  schedule: ScheduleEntity;

  @ManyToOne(() => UserEntity, (user) => user.histories)
  user: UserEntity;

  @ManyToOne(() => LabEntity, (lab) => lab.histories)
  lab: LabEntity;
}
