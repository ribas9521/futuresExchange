const { Router } = require("express");
const instrument = require("./instrument").router;

const router = new Router();
router.use("/instrument", instrument);

exports.router = router;
