import { Injectable } from "@nestjs/common";
import { LabEntity } from "src/database/entity";
import { LabRepository } from "src/database/repository";
import { CreateLabDto } from "src/dto";

@Injectable()
export class LabService {
    constructor(
        private readonly labRepository: LabRepository
    ) { }

    async create(labInfo: CreateLabDto) {
        const labEntity = new LabEntity()
        labEntity.nameLab = labInfo.nameLab;
        labEntity.isDoingUse = false;
        const result = this.labRepository.save(labEntity);
        return result;
    }

    async findOne(id: any) {
        const lab = await this.labRepository.findOne(id?.id);
        return lab;
    }

    async findAll() {
        const findAll = this.labRepository.findAll();
        return findAll;
    }

}