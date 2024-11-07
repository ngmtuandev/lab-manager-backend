import { LabEntity } from "../entity";
import { GenericRepository } from "./generic.repository";
import { EntityTarget, Repository } from 'typeorm';

export class LabRepository extends GenericRepository<LabEntity> {
    protected repository: Repository<LabEntity>;

    getEntityType(): EntityTarget<LabEntity> {
        return LabEntity;
    }

    async findOne(id: number) {
        const lab = await this.repository.findOne({
            where: {
                id
            }
        })
        return lab;
    }

    async findAll() {
        const result = await this.repository.find({
            order: {
                createdAt: 'ASC', // Sắp xếp theo createdAt giảm dần
            },
        });
        return result;
    }

}