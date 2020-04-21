export class User {
    uuid;
    latitude;
    longitude;


    constructor(uuid, latitude, longitude) {
        this.uuid = uuid;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    static fromJSON(json) {
        let user = JSON.parse(json);
        return new User(user.uuid, user.latitude, user.longitude);
    }
}
