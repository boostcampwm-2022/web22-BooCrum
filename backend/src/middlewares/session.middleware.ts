import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import * as session from 'express-session';
import * as MySQLStore from 'express-mysql-session';

const MySqlStorage = MySQLStore(session);
const sqlStorage = new MySqlStorage({
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(response: Response, next: NextFunction): void {
    response.on('finish', () => {
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sqlStorage,
        cookie: {
          maxAge: 6000 * 24 * 365,
          httpOnly: true,
        },
      });
    });

    next();
  }
}
