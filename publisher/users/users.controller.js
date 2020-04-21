const uuidv4 = require('uuid/v4');
const users = new Map();

const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
};

/**
 * add user subscriber
 */
exports.addUser = (req, res) => {
    res.writeHead(200, headers);

    //Create a new user identified by an id
    const newUser = { id: uuidv4(), res };
    users.set(newUser.id, newUser);

    //inform the user that the connection is accepted
    res.write('OK\n\n');
    console.log(newUser.id + ' Connection established');

    // When the user closes connection we update the user list
    // avoiding the disconnected one
    req.on('close', () => {
        console.log(newUser.id + ' Connection closed');
        users.delete(newUser.id);
    });
};

/**
 * Get the quantity of users connected
 */
exports.getUserQuantity = (req, res) => {
    res.status(200).json(users.size);
};

/**
 * Emit the updated event to all users
 */
exports.pushEventInformation = (event) => {
    users.forEach(u => {
        u.res.write('event: message \n');
        u.res.write('data:' + JSON.stringify(event) + '\n\n ');
    });
};