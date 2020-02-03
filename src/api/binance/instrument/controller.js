const ccxt = require("ccxt");
const { errorHandler } = require("../../../services/errorHandler");
const InstrumentService = require("./service");

const binance = new ccxt.binance({
  apiKey: "37b227b170f61da6696ee83ef81d5225869d2ea16aff1980d546ffafce89a6c7",
  secret: "1fa5a3c4e279c8b179495b606775913b9eafea536f96d3ee3ddc924e5e943d19",
  timeout: 30000,
  enableRateLimit: true,
  urls: {
    api: {
      fapiPublic: "https://testnet.binancefuture.com/fapi/v1", // ←------  fapi prefix here
      fapiPrivate: "https://testnet.binancefuture.com/fapi/v1" // ←------  fapi prefix here
    }
  },
  options: { defaultType: "future", warnOnFetchOpenOrdersWithoutSymbol: false }
});

exports.getInstrumentInfo = async (req, res) => {
  try {
    const { instrumentName } = req.query;
    const { exchangeMarkets } = req;
    const instrumentService = new InstrumentService({
      exchange: binance,
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
    const { exchangeMarkets } = req;
    const instrumentService = new InstrumentService({
      exchange: binance,
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
  const { instrument, exchangeMarkets } = req;
  try {
    const instrumentService = new InstrumentService({
      exchange: binance,
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
