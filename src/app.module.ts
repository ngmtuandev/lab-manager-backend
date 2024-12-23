import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import {
  AuthModule,
  HistoryModule,
  LabModule,
  NotifyModule,
  RequestModule,
  ScheduleModule,
  UserModule,
} from './domain';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { ScheduleModule as ScheduleModuleLib } from '@nestjs/schedule';
import { MailController } from './domain/mailer/MailController';
import { MailService } from './domain/mailer/MailService';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    DatabaseModule,
    HistoryModule,
    UserModule,
    LabModule,
    AuthModule,
    ScheduleModule,
    RequestModule,
    NotifyModule,
    ScheduleModuleLib.forRoot(),
  ],
  controllers: [AppController, MailController],
  providers: [
    AppService,
    MailService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
