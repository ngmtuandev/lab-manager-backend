import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { GenericEntity } from './generic.entity';
import { UserEntity } from './user.entity';
import { LabEntity } from './lab.entity';
import { HistoryEntity } from './history.entity';

@Entity()
export class ScheduleEntity extends GenericEntity {
  @Column()
  name: string; // Tên của lịch học

  @Column({ type: 'date' })
  date: Date; // Ngày dạy

  @Column({ type: 'time' })
  startTime: string; // Giờ vào

  @Column({ type: 'time' })
  endTime: string; // Giờ ra

  @Column({ default: false })
  hasCheckedIn: boolean; // Indicates if the schedule has been checked in

  @Column({ default: false })
  hasCheckedOut: boolean;

  @ManyToOne(() => LabEntity, (lab) => lab.histories)
  room: LabEntity; // Phòng học (LabEntity)

  @ManyToOne(() => UserEntity, (teacher) => teacher.schedules)
  teacher: UserEntity; // Giáo viên phụ trách

  @Column({ default: true })
  isActive: boolean; // Trạng thái hoạt động của lịch học

  @OneToMany(() => HistoryEntity, (history) => history.schedule)
  histories: HistoryEntity[];
}
