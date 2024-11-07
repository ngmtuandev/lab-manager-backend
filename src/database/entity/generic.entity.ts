import { BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

export abstract class GenericEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id?: number;

    @Column('int', { name: 'active', nullable: true, default: 1 })
    createdBy?: string | null;

    @Column('timestamp', {
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: true
    })
    createdAt!: Date;
}
