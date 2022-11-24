import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TeamModule } from './team/team.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ObjectDatabaseModule } from './object-database/object-database.module';
import { AppGateway } from './app.gateway';
import { HttpModule } from '@nestjs/axios';
import { config } from './ormconfig';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(config),
    UserModule,
    TeamModule,
    WorkspaceModule,
    AuthModule,
    ObjectDatabaseModule,
    HttpModule,
  ],
  controllers: [],
  providers: [AppService, AppGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
