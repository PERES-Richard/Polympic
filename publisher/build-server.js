const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const organizer = require('./organizers');
const user = require('./users');
const instantiate = require('./instantiate');

module.exports = (cb) => {
    const app = express();
    app.disable('x-powered-by');
    app.use(cors());
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
    app.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]'));
    app.use('/organizer', organizer);
    app.use('/user', user);
    app.use('/instantiate', instantiate);
    app.use('*', (req, res) => res.status(404).end());
    const server = app.listen(process.env.PORT || 9428, () => cb && cb(server));
};