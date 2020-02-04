const { Router } = require("express");
const { isInstrumentValid } = require("../../middleware");
const router = new Router();
const { createOrder } = require("./controller");
router.post("/", isInstrumentValid, createOrder);

exports.router = router;
