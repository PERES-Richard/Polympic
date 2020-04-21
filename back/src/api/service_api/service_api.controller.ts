import { Controller, Post, Body, Get, HttpService, InternalServerErrorException, ValidationPipe, BadRequestException } from '@nestjs/common';
import { ServiceApiService } from './service_api.service';
import { ApiCreatedResponse } from "@nestjs/swagger";
import {User} from "../../user/user/user.entity";
import { SetUsersRequestDto, RequestUserPositionDto } from './dto';

@Controller('service_api')
export class ServiceApiController {
    constructor(private readonly serviceApiService: ServiceApiService) { }

    @Post('set_users')
    @ApiCreatedResponse({
        description: 'The service and its users has been created or updated',
        type: [User],
    })
    async addAll(@Body() input: SetUsersRequestDto){
        if (input.service === undefined || input.users === undefined) {
            throw new BadRequestException();
        }
        try {
            return await this.serviceApiService.setUsers(input.service, input.users);
        } catch(err) {
            throw new InternalServerErrorException();
        }
    }

    @Post('request_user_position')
    @ApiCreatedResponse({
        description: 'The user position will be transmitted during a specific time',
        type: User,
    })
    async shareUser(@Body() input: RequestUserPositionDto){
        let result = this.serviceApiService.addSharedUser(input.service, input.uuid, input.duration, input.address);
        return result;
    }
}
