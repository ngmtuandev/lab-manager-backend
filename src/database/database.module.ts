import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  HistoryEntity,
  LabEntity,
  NotifyEntity,
  RequestEntity,
  RoleEntity,
  ScheduleEntity,
  UserEntity,
} from './entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres.railway.internal',
      port: 5432,
      username: 'postgres',
      password: 'AiKUHwEevcljnYcALVvIjdDoyyRyQBKY',
      database: 'railway',
      entities: [
        HistoryEntity,
        UserEntity,
        LabEntity,
        RoleEntity,
        ScheduleEntity,
        RequestEntity,
        NotifyEntity,
      ],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false, // Cần khi Railway yêu cầu SSL
      },
      autoLoadEntities: true,
    }),
  ],
})

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5432,
//       username: 'postgres',
//       password: 'Manhtuan123***',
//       database: 'do_an',
//       entities: [
//         HistoryEntity,
//         UserEntity,
//         LabEntity,
//         RoleEntity,
//         ScheduleEntity,
//         RequestEntity,
//         NotifyEntity,
//       ],
//       synchronize: true,
//       // ssl: {
//       //   rejectUnauthorized: false, // Cần khi Railway yêu cầu SSL
//       // },
//       // autoLoadEntities: true,
//     }),
//   ],
// })

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'pg-3867fca-nguyenmanhtuancomputer-4939.l.aivencloud.com',
//       port: 22085,
//       username: 'avnadmin',
//       password: 'AVNS_uDO6u2sbSeZxpBzE0xT',
//       database: 'defaultdb',
//       entities: [
//         HistoryEntity,
//         UserEntity,
//         LabEntity,
//         RoleEntity,
//         ScheduleEntity,
//         RequestEntity,
//         NotifyEntity,
//       ],
//       synchronize: false,
//       ssl: {
//         rejectUnauthorized: false, // Cần khi Railway yêu cầu SSL
//       },
//       // autoLoadEntities: true,
//     }),
//   ],
// })
export class DatabaseModule {}
