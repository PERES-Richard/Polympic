module.exports = {
    generateRandomData
};
  
// Make sure to "npm install faker" first.
const uuidv4 = require('uuid/v4');

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

function generateRandomData(userContext, events, done) {
    // generate data with Faker:
    const uuid = uuidv4();
    // const latitude = getRandomInRange(-180, 180, 3);
    // const longitude = getRandomInRange(-180, 180, 3);
    const latitude = 43.6155245+((Math.random()*5)/1000);
    const longitude = 7.0721932+((Math.random()*5)/1000)
    
    // add variables to virtual user's context:
    userContext.vars.uuid = uuid;
    userContext.vars.latitude = latitude;
    userContext.vars.longitude = longitude;
    // continue with executing the scenario:
    return done();
}