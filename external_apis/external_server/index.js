const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();

let current_user = {};

let incidents = [];

let events = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

//user service
app.get('/current_user', (req, res) => {
  res.send(current_user)
});

app.post('/polympic/user_position', (req, res) => {
    current_user = req.body;
    res.send("Ok");
});


//incident service
app.get('/get_incidents', (req, res) => {
  res.send(incidents);
});

app.post('/add_incident', (req, res) => {
  incidents.push(req.body);
  console.log(incidents);
  res.send('Ok');
});


//events service
app.get('/get_events', (req, res) => {
  res.send(events);
});

app.post('/add_events', (req, res) => {
  events.push(req.body);
  res.send('Ok');
});


app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
});

