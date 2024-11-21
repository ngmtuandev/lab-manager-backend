import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as multer from 'multer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  app.enableCors({
    origin: '*', // Cho phép tất cả các nguồn gốc
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Các phương thức được cho phép
    credentials: true, // Cho phép cookie hoặc thông tin xác thực khác
  });
  // app.use(
  //   multer().any(), // Handling multipart/form-data requests with multer
  // );
  await app.listen(3000);
}
bootstrap();
