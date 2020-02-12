const { Router } = require("express");
const { isInstrumentValid } = require("../../middleware");

const router = new Router();
const { getLeverage, setLeverage } = require("./controller");
router.get("/", isInstrumentValid, getLeverage);
router.post("/", isInstrumentValid, setLeverage);

exports.router = router;
