import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from "src/database/repository";

@Module({
    controllers: [AuthController],
    providers: [AuthService, UserRepository],
    imports: [
    ],
})
export class AuthModule { }
