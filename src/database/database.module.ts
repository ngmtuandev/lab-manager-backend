import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  HistoryEntity,
  LabEntity,
  RequestEntity,
  RoleEntity,
  ScheduleEntity,
  UserEntity,
} from './entity';

// TODO: FIX .ENV
// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'postgres.railway.internal',
//       port: 5432,
//       username: 'postgres',
//       password: 'AiKUHwEevcljnYcALVvIjdDoyyRyQBKY',
//       database: 'railway',
//       entities: [
//         HistoryEntity,
//         UserEntity,
//         LabEntity,
//         RoleEntity,
//         ScheduleEntity,
//         RequestEntity,
//       ],
//       synchronize: true,
//       ssl: {
//         rejectUnauthorized: false, // Cần khi Railway yêu cầu SSL
//       },
//       autoLoadEntities: true,
//     }),
//   ],
// })

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Manhtuan123***',
      database: 'do_an',
      entities: [
        HistoryEntity,
        UserEntity,
        LabEntity,
        RoleEntity,
        ScheduleEntity,
        RequestEntity,
      ],
      synchronize: true,
      // ssl: {
      //   rejectUnauthorized: false, // Cần khi Railway yêu cầu SSL
      // },
      // autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {}
