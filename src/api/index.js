const { Router } = require("express");
const bodyParser = require("body-parser");
const binance = require("./binance").router;
const ftx = require("./ftx").router;
const bitmex = require("./bitmex").router;
const { loadExchangeMarkets } = require("./middleware/index");
const router = Router();
router.use(bodyParser.json({ limit: "10mb" }));
router.use("/binance", loadExchangeMarkets, binance);
router.use("/ftx", ftx);
router.use("/bitmex", bitmex);

exports.router = router;
