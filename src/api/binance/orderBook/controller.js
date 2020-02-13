const ccxt = require("ccxt");
const { errorHandler } = require("../../../services/errorHandler");
const OrderBookService = require("./service");

exports.getOrderbook = async (req, res) => {
  try {
    const { instrumentName } = req.query;
    const { exchangeMarkets, exchange } = req;
    const orderBookService = new OrderBookService({
      exchange,
      exchangeMarkets
    });
    const orderBook = await orderBookService.getOrderBook(instrumentName);
    return res.status(200).json(orderBook);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};
