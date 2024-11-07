import { Module } from "@nestjs/common";
import { HistoryController } from "./history.controller";
import { HistoryService } from "./history.service";
import { HistoryRepository, LabRepository, UserRepository } from "src/database/repository";

@Module({
    controllers: [HistoryController],
    providers: [HistoryService, HistoryRepository, LabRepository, UserRepository],
    imports: [
    ],
})
export class HistoryModule { }