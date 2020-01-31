const ccxt = require("ccxt");
bitmex = new ccxt.bitmex({
  apiKey: "xKHui59VE9FP_0SjlLwQ0bVn",
  secret: "WAxEPMkK12IQtTqooxmXaQx63IejA6o_Q0kc4rEYxCrfoIfV",
  timeout: 30000,
  //enableRateLimit: true,

  options: { defaultType: "future", warnOnFetchOpenOrdersWithoutSymbol: false },
  urls: {
    api: {
      public: "https://testnet.bitmex.com",
      private: "https://testnet.bitmex.com"
    }
  }
});

exports.markets = async (req, res) => {
  try {
    const bitmexMarkets = await bitmex.fetchMarkets();
    res.status(200).json(bitmexMarkets);
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "INTERNAL ERROR" });
  }
};

exports.ticker = async (req, res) => {
  try {
    const bitmexTicker = await bitmex.fetchTicker("BTC/USD");
    res.status(200).json(bitmexTicker);
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "INTERNAL ERROR" });
  }
};
exports.fetchBalance = async (req, res) => {
  try {
    const bitmexTicker = await bitmex.fetchBalance();
    res.status(200).json(bitmexTicker);
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "INTERNAL ERROR" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const bitmexCreatedOrder = await bitmex.createOrder(
      "BTC/USD",
      "limit",
      "sell",
      "88",
      "9000"
    );
    res.status(200).json(bitmexCreatedOrder);
  } catch (e) {
    console.log(e);
    res.status(500).json({ e });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const bitmexAllOrders = await bitmex.fetchOrders();
    res.status(200).json(bitmexAllOrders);
  } catch (e) {
    console.log(e);
    res.status(500).json({ e });
  }
};
