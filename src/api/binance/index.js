const { Router } = require("express");
const instrument = require("./instrument").router;
const orderBook = require("./orderBook").router;
const order = require("./order").router;
const position = require("./position").router;
const leverage = require("./leverage").router;

const router = new Router();
router.use("/instrument", instrument);
router.use("/orderBook", orderBook);
router.use("/order", order);
router.use("/position", position);
router.use("/leverage", leverage);

exports.router = router;
