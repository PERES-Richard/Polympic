const EventSource = require('eventsource');
const OrganizerController = require('../organizers/organizers.controller');
const UserController = require('../users/users.controller');

exports.instantiateUserPosition = (hostname, port) => {
    const event = new EventSource('http://' + hostname + ':' + port + '/user/init_sse_connection');
    event.onerror = (err) => {
        console.log(err);
        event.close();
    };
    event.onmessage = (ev) => {
        console.log(ev.data);
        const value = { user: JSON.parse(ev.data)};
        OrganizerController.pushUserPositionInformation(value);
    };
};

exports.instantiateEvent = (hostname, port) => {
    const event = new EventSource('http://' + hostname + ':' + port + '/event/init_sse_connection');
    event.onerror = (err) => {
        console.log(err);
        event.close();
    };
    event.onmessage = (ev) => {
        console.log(ev.data);
        const value = { event: JSON.parse(ev.data)};
        OrganizerController.pushEventInformation(value);
        UserController.pushEventInformation(value);
    };
};