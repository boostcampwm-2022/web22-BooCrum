import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import session from 'express-session';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const MySQLStore = require('express-mysql-session')(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Session 초기화 코드 =====================
  // const MySqlStorage = MySQLStore(session);
  // const sqlStorage = new MySqlStorage({
  //   host: process.env.MYSQL_HOST,
  //   port: parseInt(process.env.MYSQL_PORT),
  //   user: process.env.MYSQL_USERNAME,
  //   password: process.env.MYSQL_PASSWORD,
  //   database: process.env.MYSQL_DATABASE,
  // });
  // app.use(
  //   session({
  //     secret: 'secret',
  //     resave: false,
  //     saveUninitialized: false,
  //     store: sqlStorage,
  //     cookie: {
  //       maxAge: 6000 * 24 * 365,
  //       httpOnly: true,
  //     },
  //   }),
  // );
  //==========================================

  await app.listen(3000);
}
bootstrap();
