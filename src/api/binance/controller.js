const ccxt = require("ccxt");
const { errorHandler } = require("../../services/errorHandler");
binance = new ccxt.binance({
  apiKey: "37b227b170f61da6696ee83ef81d5225869d2ea16aff1980d546ffafce89a6c7",
  secret: "1fa5a3c4e279c8b179495b606775913b9eafea536f96d3ee3ddc924e5e943d19",
  timeout: 30000,
  //enableRateLimit: true,
  urls: {
    api: {
      fapiPublic: "https://testnet.binancefuture.com/fapi/v1", // ←------  fapi prefix here
      fapiPrivate: "https://testnet.binancefuture.com/fapi/v1" // ←------  fapi prefix here
    }
  },
  options: { defaultType: "future", warnOnFetchOpenOrdersWithoutSymbol: false }
});

exports.getInstruments = async (req, res) => {
  try {
    let { symbol } = req.query;
    const { binanceMarkets } = req;
    if (symbol) {
      symbol = symbol.toUpperCase();
      if (binanceMarkets[symbol])
        return res.status(200).json(binanceMarkets[symbol]);
      else
        return res
          .status(404)
          .json({ type: "parameter", message: "Symbol not found" });
    } else {
      let binanceMarketsList = await binance.fetchMarkets();
      return res.status(200).json(binanceMarketsList);
    }
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};

exports.getOrderBook = async (req, res) => {
  try {
    let { symbol } = req.query;
    const { binanceMarkets } = req;
    if (symbol) {
      symbol = symbol.toUpperCase();
      if (binanceMarkets[symbol]) {
        const orderBook = await binance.fetchOrderBook(symbol);
        return res.status(200).json(orderBook);
      } else
        return res.status(404).json({
          type: "parameter",
          message: "This symbol does not exist in this exchange"
        });
    } else {
      return res
        .status(500)
        .json({ type: "parameter", message: "Symbol is required" });
    }
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};

exports.fetchBalance = async (req, res) => {
  try {
    console.log(binance);
    const binanceMarkets = await binance.fetchBalance();
    res.status(200).json(binanceMarkets);
  } catch (e) {
    const error = errorHanlder(e);
    res.status(500).json({ error });
  }
};

exports.ticker = async (req, res) => {
  try {
    const binanceTicker = await binance.fetchTicker("BTC/USDT");
    res.status(200).json(binanceTicker);
  } catch (e) {
    const error = errorHanlder(e);
    res.status(500).json({ error });
  }
};
exports.createOrder = async (req, res) => {
  try {
    const binanceCreatedOrder = await binance.createOrder(
      "BTC/USDT",
      "market",
      "sell",
      "1"
      //"9000"
    );
    res.status(200).json(binanceCreatedOrder);
  } catch (e) {
    const error = errorHanlder(e);
    res.status(500).json({ error });
  }
};
exports.getOrders = async (req, res) => {
  try {
    const binanceCreatedOrder = await binance.fetchOpenOrders();
    res.status(200).json(binanceCreatedOrder);
  } catch (e) {
    const error = errorHanlder(e);
    res.status(500).json({ error });
  }
};

exports.postLeverage = async (req, res) => {
  try {
    const binanceLevaregePost = await ftx.privatePostAccountLeverage({
      leverage: 5
    });
    res.status(200).json(binanceLevaregePost);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};
