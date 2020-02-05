const { Router } = require("express");
const { isInstrumentValid } = require("../../middleware");
const router = new Router();
const { createOrder, getOrder, cancelOrder } = require("./controller");
router.post("/", isInstrumentValid, createOrder);
router.get("/", isInstrumentValid, getOrder);
router.delete("/", isInstrumentValid, cancelOrder);

exports.router = router;
