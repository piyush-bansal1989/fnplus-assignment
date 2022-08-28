import { Controller } from '@nestjs/common';
import { TransactionDetails } from '../transaction-details.entity';
import { TransactionService } from './transaction.service';
import { Post, Body, Res, HttpStatus } from '@nestjs/common';

@Controller('transaction')
export class TransactionController {
    constructor (private transactionService: TransactionService){}

    @Post('deposit')
    async deposit(@Res() res, @Body() requestData: any[]): Promise<any> {
        const response = await this.transactionService.depositAmount(requestData);
        
        return res.status(HttpStatus.OK).json({
            message: "deposit",
            data: response,
            status: "success"
          });  
    }

    @Post('withdraw')
    async withdraw(@Res() res, @Body() requestData: any[]): Promise<any> {
        const response = await this.transactionService.withdrawAmount(requestData);

        return res.status(HttpStatus.OK).json({
            message: "withdraw",
            data: response,
            status: "success"
          }); 
    }

    @Post('transfer')
    async transfer(@Res() res, @Body() requestData: any[]): Promise<any> {
        const response =  await this.transactionService.transferAmount(requestData);
        var msg = "Transfered Succefully";

        if (response['msg'] != undefined && response['msg'] != '') {
          msg = response['msg'];
          delete response['msg'];
        }
        
        return res.status(HttpStatus.OK).json({
            message: msg,
            data: response,
            status: "success"
          });
    }

}
