import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { LabRepository, UserRepository } from "src/database/repository";

@Module({
    controllers: [UserController],
    providers: [UserService, UserRepository, LabRepository],
    imports: [
    ],
})
export class UserModule { }