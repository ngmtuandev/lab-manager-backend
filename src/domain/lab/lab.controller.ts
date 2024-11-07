import { Body, Controller, Get, Post } from "@nestjs/common";
import { LabService } from "./lab.service";
import { CreateLabDto } from "src/dto";

@Controller('lab')
export class LabController {

    constructor(private readonly labService: LabService) { }

    @Post("create")
    async create(@Body() createInfo: CreateLabDto) {
        try {
            const result = await this.labService.create(createInfo);
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
            const result = await this.labService.findOne(id);
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
            const result = await this.labService.findAll();
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