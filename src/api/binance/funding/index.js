const { Router } = require("express");
const { isInstrumentValid } = require("../../middleware");

const router = new Router();
const { getFunding } = require("./controller");
router.get("/", isInstrumentValid, getFunding);

exports.router = router;
