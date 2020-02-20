const { Router } = require('express');
const { isInstrumentValid } = require('../../middleware');
const router = new Router();
const {
  createOrder,
  getOrder,
  cancelOrder,
  updateOrder,
  cancelAllOrders,
  getAllOrders,
  getAllOpenOrders
} = require('./controller');
router.post('/', isInstrumentValid, createOrder);
router.post('/cancel/all', isInstrumentValid, cancelAllOrders);
router.get('/', isInstrumentValid, getOrder);
router.get('/open', isInstrumentValid, getAllOpenOrders);
router.get('/all', isInstrumentValid, getAllOrders);
router.delete('/', isInstrumentValid, cancelOrder);
router.put('/', isInstrumentValid, updateOrder);

exports.router = router;
