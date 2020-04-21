import {Socket} from "socket.io";

export class UserSocket {
  private uuid: string;
  private readonly socket: Socket;

  constructor(socket: Socket){
    this.socket = socket;
    this.uuid = null;
  }

  public setUuid(uuid: string):void{
    this.uuid = uuid;
  }

  public getUuid(){
    return this.uuid;
  }

  public getSocket():Socket{
    return this.socket;
  }
}
