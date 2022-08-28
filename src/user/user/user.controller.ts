import { Controller } from '@nestjs/common';
import { User } from '../user.entity';
import { UserService } from './user.service';
import { Post, Get, Body, Res, HttpStatus } from  '@nestjs/common';

@Controller('user')
export class UserController {
	constructor(private userService: UserService){}

	@Get()
    async index(@Res() res): Promise<User[]> {
      const response = await this.userService.listUsers();

      return res.status(HttpStatus.OK).json({
        message: "list of all users",
        data: response,
        status: "success"
      });
    } 

    @Post('create')
    async create(@Res() res, @Body() userData: User): Promise<any> {
      const response = await this.userService.create(userData);

      return res.status(HttpStatus.OK).json({
        message: "user created",
        data: response,
        status: "success"
      });
    }

    @Post('update')
    async update(@Res() res, @Body() userData: User): Promise<any> {
        const response = await this.userService.update(userData);
        var msg = "Details not updated";

        if (response['affected']==1){
          msg = "User details updated";
        }

        return res.status(HttpStatus.OK).json({
          message: msg,
          data: response,
          status: "success"
        });
    }

    @Post('delete')
    async delete(@Res() res, @Body() userData: number): Promise<any> {
      const response = await this.userService.delete(userData);

      return res.status(HttpStatus.OK).json({
        message: "user deactivated",
        data: response,
        status: "success"
      });
    }

    @Get('get-user-info')
    async getUserData(@Res() res, @Body() userData: User): Promise<any> {
      const response = await this.userService.getUserData(userData);

      return res.status(HttpStatus.OK).json({
        message: "user detail",
        data: response,
        status: "success"
      });
    }
}
