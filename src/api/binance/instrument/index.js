const { Router } = require("express");
const { isInstrumentValid } = require("../../middleware");
const {
  getInstruments,
  getInstrumentInfo,
  getPriceInfo,
  getFeeInfo
} = require("./controller");

const router = new Router();
router.use("/info", isInstrumentValid, getInstrumentInfo);
router.use("/all", getInstruments);
router.use("/price", isInstrumentValid, getPriceInfo);
router.use("/fee", isInstrumentValid, getFeeInfo);

exports.router = router;
