
export class UserFacade {
  uuid: string;
  latitude: number;
  longitude: number;

  constructor(uuid: string, latitude: number, longitude: number){
    this.uuid = uuid;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
