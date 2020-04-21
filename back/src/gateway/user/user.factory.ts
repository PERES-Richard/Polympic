import {InvalidClassException} from "@nestjs/core/errors/exceptions/invalid-class.exception";
import {UserFacade} from "./user.facade";

export abstract class UserFactory {

  /**
   * Check if an user is valid and return the corresponding object
   * We use a factory because the dto return the error to the request but can't return error to the socket so we check mannually
   * @param user the user to check validity
   */
  public static createUser(user: Object): UserFacade{
    let uuid;
    let latitude;
    let longitude;
    if(user.hasOwnProperty('uuid'))
      uuid = user['uuid'];
    else
      throw new InvalidClassException("Uuid is missing so User");
    if(user.hasOwnProperty('latitude'))
      latitude = parseFloat(user['latitude']);
    else
      throw new InvalidClassException("Latitude is missing so User");
    if(user.hasOwnProperty('longitude'))
      longitude = parseFloat(user['longitude']);
    else
      throw new InvalidClassException("Longitude is missing so User");
    return new UserFacade(uuid, latitude, longitude);
  }
}
