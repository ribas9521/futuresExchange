const { Router } = require("express");
const { markets, ticker, postLeverage, createOrder } = require("./controller");

const router = new Router();
router.use("/markets", markets);
router.use("/ticker", ticker);
router.use("/createOrder", createOrder);
router.use("/postLeverage", postLeverage);
exports.router = router;
