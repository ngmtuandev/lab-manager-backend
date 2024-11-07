import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post("create")
    async create(@Body() createInfo: any) {
        try {
            const result = await this.userService.create(createInfo);
            if (result) {
                return {
                    status: "SUCCESS",
                    isSuccess: true,
                    data: result
                }
            }
            else {
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

    @Post("find-one")
    async findOne(@Body() id: any) {
        try {
            const result = await this.userService.findOne(id);
            if (result) {
                return {
                    status: "SUCCESS",
                    isSuccess: true,
                    data: result
                }
            }
            else {
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

    @Post("find-all")
    async findAll() {
        try {
            const result = await this.userService.findAll();
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