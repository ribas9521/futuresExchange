const { Router } = require("express");
const {
  markets,
  ticker,
  createOrder,
  getOrders,
  fetchBalance
} = require("./controller");

const router = new Router();
router.use("/markets", markets);
router.use("/ticker", ticker);
router.use("/fetchBalance", fetchBalance);
router.use("/getOrders", getOrders);
router.use("/createOrder", createOrder);

exports.router = router;
