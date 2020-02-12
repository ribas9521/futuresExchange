const { Router } = require("express");
const { isInstrumentValid } = require("../../middleware");
const router = new Router();
const {
  createOrder,
  getOrder,
  cancelOrder,
  updateOrder
} = require("./controller");
router.post("/", isInstrumentValid, createOrder);
router.get("/", isInstrumentValid, getOrder);
router.delete("/", isInstrumentValid, cancelOrder);
router.put("/", isInstrumentValid, updateOrder);

exports.router = router;
