import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "src/dto";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {};

    @Post('login')
    async login(@Body() loginInfo: LoginDto) {
        try {
            const result = await this.authService.login(loginInfo);
            if (result) {
                return {
                    status: "SUCCESS",
                    isSuccess: true,
                    data: result
                }
            } else {
                return {
                    status: "FAIL",
                    isSuccess: false,
                }
            }
        } catch (error) {
            return {
                status: "FAIL",
                isSuccess: false,
            }
        }
    }

}