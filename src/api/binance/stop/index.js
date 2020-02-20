const { Router } = require('express');
const { isInstrumentValid } = require('../../middleware');

const router = new Router();
const { getStops, getOpenStops } = require('./controller');
router.get('/', isInstrumentValid, getStops);
router.get('/open', isInstrumentValid, getOpenStops);

exports.router = router;
