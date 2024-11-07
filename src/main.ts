import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: false});
  app.enableCors({
    origin: 'http://localhost:8081', // Địa chỉ frontend của bạn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Các phương thức được cho phép
    credentials: true, // Cho phép cookie hoặc thông tin xác thực khác
  });
  await app.listen(3000);
}
bootstrap();
