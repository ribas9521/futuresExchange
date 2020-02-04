const ccxt = require("ccxt");
const { errorHandler } = require("../../../services/errorHandler");
const InstrumentService = require("./service");

exports.getInstrumentInfo = async (req, res) => {
  try {
    const { instrumentName } = req.query;
    const { exchangeMarkets, exchange } = req;
    const instrumentService = new InstrumentService({
      exchange,
      exchangeMarkets
    });
    const resp = instrumentService.getInstrumentInfo(
      instrumentName.toUpperCase()
    );
    return res.status(200).json(resp);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};

exports.getInstruments = async (req, res) => {
  try {
    const { exchangeMarkets, exchange } = req;
    const instrumentService = new InstrumentService({
      exchange,
      exchangeMarkets
    });
    const allInstruments = instrumentService.getInstruments();
    return res.status(200).json(allInstruments);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};

exports.getPriceInfo = async (req, res) => {
  const { instrument, exchangeMarkets, exchange } = req;
  try {
    const instrumentService = new InstrumentService({
      exchange,
      exchangeMarkets
    });
    const priceInfo = await instrumentService.getPriceInfo(instrument);
    return res.status(200).json(priceInfo);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};

exports.getFeeInfo = async (req, res) => {
  const instrumentService = new InstrumentService({});
  const feeInfo = instrumentService.getFeeInfo();
  return res.status(200).json(feeInfo);
};
