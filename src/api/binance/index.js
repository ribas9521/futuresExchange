const { Router } = require("express");
const instrument = require("./instrument").router;
const orderBook = require("./orderBook").router;
const order = require("./order").router;

const router = new Router();
router.use("/instrument", instrument);
router.use("/orderBook", orderBook);
router.use("/order", order);

exports.router = router;
