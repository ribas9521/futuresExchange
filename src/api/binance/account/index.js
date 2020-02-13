const { Router } = require("express");

const router = new Router();
const { getBalance } = require("./controller");
router.get("/balance", getBalance);

exports.router = router;
