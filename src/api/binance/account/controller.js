const { errorHandler } = require("../../../services/errorHandler");
const AccountService = require("./service");

exports.getBalance = async (req, res) => {
  try {
    const { exchangeMarkets, exchange } = req;

    const accountService = new AccountService({
      exchange,
      exchangeMarkets
    });
    const balance = await accountService.getBalance();
    return res.status(200).json(balance);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};
