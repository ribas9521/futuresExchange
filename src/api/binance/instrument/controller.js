const ccxt = require("ccxt");
const { errorHandler } = require("../../../services/errorHandler");
const { getTicker, fetchBidsAsks } = require("../../../services/general");
const { getMarkPrice } = require("../helper");
const {
  instrumentInfoParser,
  priceInfoParser,
  feeInfoParser
} = require("../parser");
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
    let { instrumentName } = req.query;
    const { exchangeMarkets } = req;
    instrumentName = instrumentName.toUpperCase();
    const parsedTicker = instrumentInfoParser(exchangeMarkets[instrumentName]);
    const resp = { ...parsedTicker, ...{ maxLeverage: 125 } };
    return res.status(200).json(resp);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};

exports.getInstruments = async (req, res) => {
  try {
    let { exchangeMarkets } = req;
    const allInstruments = [];
    for (let instrument in exchangeMarkets) {
      allInstruments.push(instrument);
    }
    return res.status(200).json(allInstruments);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};

exports.getPriceInfo = async (req, res) => {
  let { instrumentName } = req.query;
  const { instrument } = req;
  try {
    const ticker = await getTicker(binance, instrumentName.toUpperCase());
    const bidsAsks = await fetchBidsAsks(binance, instrumentName.toUpperCase());
    const markPrice = await getMarkPrice(binance, instrument.symbol);
    const priceInfo = priceInfoParser(instrument, ticker, bidsAsks, markPrice);
    return res.status(200).json(priceInfo);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};

exports.getFeeInfo = async (req, res) => {
  const { instrument } = req;
  const feeInfo = feeInfoParser(instrument);
  return res.status(200).json(feeInfo);
};
