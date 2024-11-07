import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/database/entity";
import { LabRepository, UserRepository } from "src/database/repository";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly labRepository: LabRepository,
    ) { }

    async create(createInfo: any) {
        // const labEntity = await this.labRepository.findOne(+createInfo?.lab);

        const userEntity = new UserEntity();

        userEntity.userName = createInfo.userName;
        userEntity.isActive = true;
        userEntity.email = createInfo.email;
        userEntity.role = createInfo.role;
        userEntity.phoneNumber = createInfo.phoneNumber;
        userEntity.password = createInfo.password;

        try {
            const result = await this.userRepository.save(userEntity);
            return result;
        } catch (error) {
            console.log("error : ================ ", error)
        }

    }

    async findOne(id: any) {
        const result = await this.userRepository.findOne(id?.id);
        return result;
    }

    async findAll() {
        const result = await this.userRepository.findAll();
        return result;
    }

}