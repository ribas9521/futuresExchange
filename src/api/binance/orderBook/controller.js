const ccxt = require("ccxt");
const { errorHandler } = require("../../../services/errorHandler");
const OrderBookService = require("./service");
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

exports.getOrderbook = async (req, res) => {
  try {
    const { instrumentName } = req.query;
    const { exchangeMarkets } = req;
    const orderBookService = new OrderBookService({
      exchange: binance,
      exchangeMarkets
    });
    const orderBook = await orderBookService.getOrderBook(instrumentName);
    return res.status(200).json(orderBook);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};
