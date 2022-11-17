import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as MySQLStore from 'express-mysql-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // 세션 초기화
  const MySqlStorage = MySQLStore(session);
  const sqlStorage = new MySqlStorage({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sqlStorage,
    cookie: {
      maxAge: 6000 * 24 * 365,
      httpOnly: true,
    },
  });
  app.use(sessionMiddleware);

  await app.listen(3000);
}
bootstrap();
