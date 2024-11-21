import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { GenericEntity } from './generic.entity';
import { ROLE_CODE } from 'src/enum/ERole';
import { LabEntity } from './lab.entity';
import { HistoryEntity } from './history.entity';
import { ScheduleEntity } from './schedule.entity';

@Entity()
export class UserEntity extends GenericEntity {
  @Column()
  userName: string;

  @Column()
  isActive: boolean;

  // TODO: CHECK
  // @Column()
  // imageDetect: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column('simple-json', { nullable: true })
  images: any[];

  @Column({
    nullable: true,
  })
  password: string;

  @Column()
  role: ROLE_CODE;

  @ManyToOne(() => LabEntity, (lab) => lab.users)
  lab: LabEntity;

  @OneToMany(() => HistoryEntity, (history) => history.user)
  histories: HistoryEntity[];

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.teacher)
  schedules: ScheduleEntity[];
}
