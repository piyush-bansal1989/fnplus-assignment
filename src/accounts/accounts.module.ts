import { Module } from '@nestjs/common';
import { UserAccountsController } from './user-accounts/user-accounts.controller';
import { UserAccountsService } from './user-accounts/user-accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountDetails } from './user-account.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports :[
    TypeOrmModule.forFeature([AccountDetails]),
    UserModule
  ],
  controllers: [UserAccountsController],
  providers: [UserAccountsService],
  exports: [UserAccountsService]
})

export class AccountsModule {}
