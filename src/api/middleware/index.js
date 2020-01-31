const ccxt = require("ccxt");
const binance = new ccxt.binance({
  options: { defaultType: "future", warnOnFetchOpenOrdersWithoutSymbol: false }
});
const { errorHandler } = require("../../services/errorHandler");
let exchangeMarkets = [];

// TODO: FAZER ESSE MÉTODO GENÉRICO
// BUSCANDO A EXCHANGE PASSADA NO CAMINHO DA ROTA
exports.loadExchangeMarkets = async (req, res, next) => {
  try {
    if (exchangeMarkets.length <= 0) {
      exchangeMarkets = await binance.loadMarkets();
    }
    req.exchangeMarkets = exchangeMarkets;
    next();
  } catch (e) {
    return res.status(500).json(errorHandler(e));
  }
};

exports.isInstrumentValid = async (req, res, next) => {
  try {
    let { instrumentName } = req.query;
    if (!instrumentName || !exchangeMarkets[instrumentName.toUpperCase()]) {
      throw { message: "Instrument not found", type: "Invalid Instrument" };
    } else {
      req.instrument = exchangeMarkets[instrumentName.toUpperCase()];
      next();
    }
  } catch (e) {
    return res.status(500).json(errorHandler(e));
  }
};
