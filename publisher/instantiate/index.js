const {Router} = require('express');
const InstantiateController = require('./instantiate.controller');

const router = new Router();
const isInstanciate = false;

router.post('/', (req, res) => {
    console.log(req.body);
    if (!isInstanciate) {
        req.body.forEach((elem) => {
            if (elem.hostname === 'nest') {
                for (let i = 1; i < (elem.quantity + 1); i++) {
                    InstantiateController.instantiateUserPosition('pns-ps7-19-20-pns-ps7-19-20-al2_nest_' + i, elem.port);
                    InstantiateController.instantiateEvent('pns-ps7-19-20-pns-ps7-19-20-al2_nest_' + i, elem.port);
                }
            } else {
                InstantiateController.instantiateUserPosition(elem.hostname, elem.port);
                InstantiateController.instantiateEvent(elem.hostname, elem.port);
            }
        });
        res.status(200).json({ status: 'ok'});
    } else {
        res.status(402).json({ message: 'Server already instantiate'});
    }
});


module.exports = router;