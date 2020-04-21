const buildServer = require('./build-server.js');

buildServer(server => console.log(`Server is listening on port ${server.address().port}`));
