import { Entity, Column, OneToMany, IsNull } from 'typeorm';
import { GenericEntity } from './generic.entity';
import { UserEntity } from './user.entity';
import { HistoryEntity } from './history.entity';
import { ScheduleEntity } from './schedule.entity';
@Entity()
export class LabEntity extends GenericEntity {
  @Column()
  nameLab: string;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  isDoingUse: boolean | false;

  @OneToMany(() => UserEntity, (user) => user.lab)
  users: UserEntity[];

  @OneToMany(() => HistoryEntity, (history) => history.lab)
  histories: HistoryEntity[];

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.room)
  schedules: ScheduleEntity[];
}
