import { Injectable } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { UpdateResult } from  'typeorm';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
        @InjectConnection() private readonly connection: Connection
	){ }

    /*
    To fetch all users details
    */
	async  listUsers(): Promise<any> {
		console.log("listUsers");
        return await this.userRepository.find();
    }

    /* 
    Create user if user not exists with same email id.
    data required to post: {"firstName":"Sanvi","lastName":"Gupta","email":"sanvi@gmail.com","mobile":"1234567890","city":"delhi","dob":"1989/07/23","middleName":""}
    */
    async  create(user: User): Promise<any> {
    	console.log("create user");
        var email = user['email'];
        if (await this.isUserExists(email) == false){
            return await this.userRepository.save(user);
        } else {
            return "user already exists with given email id";
        }
    }

    /*
     Update user details if user exists with email id else return empty object
     */
    async update(user: User): Promise<UpdateResult> {
    	console.log("update user");
    	var email = user['email'];
        var response = {};
        response['affected'] = 0;
        response['generatedMaps'] = [];
        response['raw'] = [];

        if (await this.isUserExists(email) == true){
            var userId = await this.getUserIdByEmail(email);
            console.log("for update userId: "+ userId);
            return  await this.userRepository.update(userId, user);
        }

        return new UpdateResult;
    }

    /*
    Mark the user inactive using user id.
    */
    async delete(userId: number): Promise<UpdateResult> {
    	console.log("delete");
    	var user = {};
    	user['isActive'] = 0;
        return await this.userRepository.update(userId, user);
    }

    /*
    Getting user data using user id
    */
	async getUserData(userId: User): Promise<any> {
        console.log("getUserData")
        return await this.userRepository.findOneBy(userId);
    }

    async isUserExists(email: string): Promise<boolean>{
        console.log("is User exists email id: "+email)
        var isUserExists = false;

        var userDetails = await this.connection.query("select userId from user where email = '"+ email+ "'");
        console.log(userDetails);
        
        if (userDetails.length == 1){
            isUserExists = true;
        }

        return isUserExists;
    }

    /*
    Checking if user exists in our database using userId.
    */
    async isUserExistsByUserId(userId: number): Promise<boolean>{
        console.log("userId: "+ userId)
        var isUserExists = false;

        var userDetails = await this.connection.query("select userId from user where userId = '"+ userId+ "'");
        console.log(userDetails);
        
        if (userDetails.length == 1){
            isUserExists = true;
        }

        return isUserExists;
    }

    /*
    Checking if user exists in our database using email.
    */
    async getUserIdByEmail(email:string): Promise<any>{
        console.log("User email id: "+ email);

        var userDetails = await this.connection.query("select userId from user where email = '"+ email+ "'");
        console.log(userDetails);
        return userDetails[0]['userId'];
    }
}
