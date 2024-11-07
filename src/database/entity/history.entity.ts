import {
    Entity,
    Column,
    ManyToOne,
} from 'typeorm';
import { GenericEntity } from './generic.entity';
import { UserEntity } from './user.entity';
import { LabEntity } from './lab.entity';
0
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
        nullable: true
    })
    timeCheckin: Date;

    @Column('timestamp', {
        name: 'timeCheckout',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: true
    })
    timeCheckout: Date;

    // TODO: check business
    // @Column()
    // evident: string

    @ManyToOne(() => UserEntity, user => user.histories)
    user: UserEntity;

    @ManyToOne(() => LabEntity, lab => lab.histories)
    lab: LabEntity;

}
