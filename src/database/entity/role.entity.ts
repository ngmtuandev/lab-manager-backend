import {
    Entity,
    Column,
} from 'typeorm';
import { GenericEntity } from './generic.entity';
0
@Entity()
export class RoleEntity extends GenericEntity {
    @Column()
    name: string;

    @Column()
    isActive: boolean;

}
