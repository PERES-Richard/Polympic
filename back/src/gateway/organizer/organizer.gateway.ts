import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Logger} from '@nestjs/common';
import {UserFacade} from '../user/user.facade';

@WebSocketGateway(3001, {namespace: 'organizer'})
export class OrganizerGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('OrganizerGateway');
  /**
   * Contains the list of organizers sockets
   */
  private organizers: Socket[] = [];

  afterInit(server: Server) {
    this.logger.log('OrganizerGateway Init');
  }

  /**
   * When an organizer become disconnected we can remove it from the list
   * @param organizer the socket of a organizer that disconnect
   */
  handleDisconnect(organizer: Socket) {
    this.logger.log(`Organizer disconnected: ${organizer.id}`);
    this.organizers.splice(this.organizers.indexOf(organizer), 1);
  }

  /**
   * When an organizer become connected to the server
   * @param organizer the socket of an organizer that connect
   * @param args
   */
  handleConnection(organizer: Socket, ...args: any[]) {
    this.logger.log(`Organizer connected: ${organizer.id}`);
    this.organizers.push(organizer);
  }

  /**
   * when a user change his coordinates this method is called so we can emit a message to every organizers to refresh the user position
   * @param user the coordinates and uuid to send
   */
  public sendCoordinatesToOrganizers(user: UserFacade):void{
    this.organizers.forEach(function(organizer: Socket){
      organizer.emit('receiveCoordinates', JSON.stringify(user));
    });
  }

  /**
   * when a user disconnect his socket we can remove it from coordinates for every organizer
   * @param uuid the user uuid to remove
   */
  public removeCoordinates(uuid: string):void{
    let log = this.logger;
    this.organizers.forEach(function(organizer: Socket){
      organizer.emit('removeCoordinates', JSON.stringify({uuid: uuid}));
      log.log(organizer.id);
    });
  }
}
