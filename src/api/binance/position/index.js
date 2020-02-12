const { Router } = require("express");
const { isInstrumentValid } = require("../../middleware");

const router = new Router();
const { getPosition } = require("./controller");
router.get("/", isInstrumentValid, getPosition);

exports.router = router;
