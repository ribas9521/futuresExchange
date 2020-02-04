const { Router } = require("express");
const { isInstrumentValid } = require("../../middleware");
const router = new Router();
const { getOrderbook } = require("./controller");
router.use("/", isInstrumentValid, getOrderbook);

exports.router = router;
