import {
    Body,
    Controller,
    Post,
    Get,
    InternalServerErrorException,
    Param
} from '@nestjs/common';
import {CreateUserDto} from "./dto";
import {UserService} from "./user.service";
import { ApiCreatedResponse } from "@nestjs/swagger";
import {User} from "./user.entity";

/**
 * users is the default route to manipulate users
 */
@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiCreatedResponse({
        description: 'The user has been successfully created or updated',
        type: User,
    })
    async addUser(
        @Body() body: CreateUserDto,
    ){
        try {
            return await this.userService.addUserPosition(body, true);
        } catch (e) {
            console.log("error :", e);
            throw new InternalServerErrorException(e);
        }
    }

    @Get('init_sse_connection')
    @ApiCreatedResponse({
        description: 'The sse connection to get an user updates has been successfully created',
    })
    async initSSEConnection(){}

    // @ts-ignore
    @Get('/inRange/:latitude/:longitude/:range')
    @ApiCreatedResponse({
        description: 'The list of users in a specific area',
        type: [User],
    })
    async getUserInRange(
        @Param('latitude') latitude: number,
        @Param('longitude') longitude: number,
        @Param('range') range: number,
    ){
        return this.userService.getUsersInRange(latitude, longitude, range);
    }

    @Get('/inRange/quantity/:latitude/:longitude/:range')
    @ApiCreatedResponse({
        description: 'The number of users in a specific area',
        type: Number,
    })
    async getNumberOfUserInRange(
        @Param('latitude') latitude: number,
        @Param('longitude') longitude: number,
        @Param('range') range: number,
    ){
        return this.userService.getNumberOfUserInRange(latitude, longitude, range);
    }

    @Get('/recentUsers')
    @ApiCreatedResponse({
        description: 'The list of users who has recently updated their positions (less than 5 minutes)',
        type: [User],
    })
    async getRecentUsers(){
        return this.userService.getRecentUsers();
    }

    @Get('/recentExternalUsers')
    @ApiCreatedResponse({
        description: 'The list of external users who has recently updated their positions (less than 5 minutes)',
        type: [User],
    })
    async getRecentExternalUsers(){
        return this.userService.getRecentExternalUsers();
    }

}
