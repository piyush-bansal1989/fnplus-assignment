import { Controller } from '@nestjs/common';
import { AccountDetails } from '../user-account.entity';
import { UserAccountsService } from './user-accounts.service';
import { Post, Get, Body, Res, HttpStatus } from  '@nestjs/common';

@Controller('user-accounts')
export class UserAccountsController {
    constructor(private userAccountService: UserAccountsService){
    }

    @Get()
    async index(@Res() res, @Body() userId: string): Promise<any> {
      const response = await this.userAccountService.userAccountDetails(userId);

      return res.status(HttpStatus.OK).json({
        message: "user account details",
        data: response,
        status: "success"
      });
    } 

    @Post('create-account')
    async create(@Res() res, @Body() userData: AccountDetails): Promise<any> {
      const response = await this.userAccountService.createAccount(userData);

      return res.status(HttpStatus.OK).json({
        message: "user account details",
        data: response,
        status: "success"
      });
    }

   /* @Post('update-account')
    async update(@Body() userData: AccountDetails): Promise<any> {
        return this.userAccountService.updateAccountDetails(userData);
    }

    @Post('deactive-account')
    async delete(@Body() userData: AccountDetails): Promise<any> {
      return this.userAccountService.deactivateAccount(userData);
    }*/
}
