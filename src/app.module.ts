import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TrasactionModule } from './trasaction/trasaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [UserModule, TrasactionModule, AccountsModule,
  TypeOrmModule.forRoot({
    type: "mysql",
    database: "db_finance",
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'root',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
  }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
