import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket} from "socket.io";
import { Logger } from "@nestjs/common";
import { UserService } from "../../user/user/user.service";
import { UserFactory} from "./user.factory";
import { CreateUserDto } from "../../user/user/dto/create-user.dto";
import { UserSocket } from "./user.socket";
import { ServiceApiService } from '../../api/service_api/service_api.service';
import { OrganizerGateway } from "../organizer/organizer.gateway";

@WebSocketGateway(3001, {namespace: 'user'})
export class UserGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('UserGateway');
  /**
   * Contains the list of users sockets
   */
  private users: UserSocket[] = [];
  constructor(private readonly userService: UserService,
              private readonly organizerGateway: OrganizerGateway,
              private readonly serviceApiService: ServiceApiService){}

  /**
   * When the gateway is opened
   */
  afterInit(server: Server) {
      this.logger.log('UserGateway Init');
  }

  /**
   * When a user become disconnected we can remove it from the list
   * @param client the socket of a user that disconnect
   */
  async handleDisconnect(client: Socket) {
    //this.logger.log(`User disconnected: ${client.id}`);
    let user = this.users.find(u => u.getSocket() == client);

    //if null the user has not already sent his coordinates
    if(user.getUuid() !== null) {
      await this.userService.deleteUserPosition(user.getUuid());
      this.organizerGateway.removeCoordinates(user.getUuid());
    }
    this.users.splice(this.users.indexOf(user), 1);
  }

  /**
   * When a user become connected to the server
   * @param client the socket of a user that connect
   * @param args
   */
  handleConnection(client: Socket, ...args: any[]) {
    //this.logger.log(`User connected: ${client.id}`);
    this.users.push(new UserSocket(client));
  }

  /**
   * When an user send his coordinates
   * @param client the user that send data
   * @param payload the data send by user
   */
  @SubscribeMessage('sendCoordinates')
  async handleMessage(client: Socket, payload: Object): Promise<void> {
    //this.logger.log(payload);
    let user = null;
    try{
      user = UserFactory.createUser(payload);
      const userFound = this.users.find(u => u.getSocket() == client);
      userFound.setUuid(user.uuid);
      await this.userService.addUserPosition(new CreateUserDto(user.uuid, user.latitude, user.longitude), false);
      client.emit('sendCoordinates', 'OK');
    }catch (e) {
      client.emit('sendCoordinates', e.msg);
    }finally {

    }
    if(user != null){
      this.organizerGateway.sendCoordinatesToOrganizers(user);
      this.serviceApiService.sendCoordinatesToService(user);
    }
  }
}
