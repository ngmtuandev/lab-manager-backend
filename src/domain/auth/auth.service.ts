import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "src/database/repository";
import { LoginDto } from "src/dto";

@Injectable()
export class AuthService {

    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async login(infoLogin: LoginDto) {
        const findUser = await this.userRepository.findByUserName(infoLogin?.userName);

        if (findUser && infoLogin.password == findUser.password) {
            return findUser;
        } 
        else {
            return false;
        }

    }

}