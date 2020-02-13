const { getOrderBook } = require("../../../services/general");
const { getOrderBookParser } = require("../parser");

class OrderBookService {
  constructor(dependencies) {
    const { exchange, exchangeMarkets } = dependencies;
    this.exchange = exchange;
    this.exchangeMarkets = exchangeMarkets;
  }
  async getOrderBook(instrumentName) {
    const orderBook = await getOrderBook(this.exchange, instrumentName);
    const parsedOrderBook = getOrderBookParser(
      orderBook,
      this.exchangeMarkets,
      instrumentName
    );
    return parsedOrderBook;
  }
}
module.exports = OrderBookService;
