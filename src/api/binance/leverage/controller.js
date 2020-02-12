const { errorHandler } = require("../../../services/errorHandler");
const LeverageService = require("./service");

exports.getLeverage = async (req, res) => {
  try {
    const { exchangeMarkets, exchange, query } = req;
    const { instrumentName } = query;

    const leverageService = new LeverageService({
      exchange,
      exchangeMarkets
    });
    const leverage = await leverageService.getLeverage(instrumentName);
    return res.status(200).json(leverage);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};
exports.setLeverage = async (req, res) => {
  try {
    const { exchangeMarkets, exchange, body } = req;

    const leverageService = new LeverageService({
      exchange,
      exchangeMarkets
    });
    const leverage = await leverageService.setLeverage(body);
    return res.status(200).json(leverage);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};
