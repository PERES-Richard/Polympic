const {Router} = require('express');
const OrganizerController = require('./organizers.controller');

const router = new Router();

router.get('/init_sse_connection', OrganizerController.addOrganizer);
router.get('/quantity', OrganizerController.getOrganizerQuantity);


module.exports = router;