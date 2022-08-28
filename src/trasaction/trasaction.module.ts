import { Module } from '@nestjs/common';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionService } from './transaction/transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TransactionDetails } from './transaction-details.entity';

@Module({
  imports :[
    TypeOrmModule.forFeature([TransactionDetails]),
    UserModule,
    AccountsModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TrasactionModule {}
