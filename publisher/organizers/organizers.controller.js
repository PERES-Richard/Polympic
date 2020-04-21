const uuidv4 = require('uuid/v4');
const organizers = new Map();

const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
};

/**
 * Add organizer subscriber
 */
exports.addOrganizer = (req, res) => {
    res.writeHead(200, headers);

    //Create a new organizer identified by an id
    const newOrganizer = { id: uuidv4(), res };
    organizers.set(newOrganizer.id, newOrganizer);

    //inform the organizer that the connection is accepted
    res.write('OK\n');
    console.log(newOrganizer.id + ' Connection established');

    // When the organizer closes connection we update the organizer list
    // avoiding the disconnected one
    req.on('close', () => {
        console.log(newOrganizer.id + ' Connection closed');
        organizers.delete(newOrganizer.id);
    });
};

/**
 * Get the quantity of organizers connected
 */
exports.getOrganizerQuantity = (req, res) => {
    res.status(200).json(organizers.size);
};

/**
 * Emit the user position updated to all organizers
 */
exports.pushUserPositionInformation = (userPos) => {
    organizers.forEach(o => {
        o.res.write('event: message \n');
        o.res.write('data:' + JSON.stringify(userPos) + '\n\n ');
    });
};

/**
 * Emit the event updated to all organizers
 */
exports.pushEventInformation = (event) => {
    organizers.forEach(o => {
        o.res.write('event: message \n\n');
        o.res.write('data:' + JSON.stringify(event) + '\n\n ');
    });
};