const { getOrderBook } = require("../../../services/general");

class OrderBookService {
  constructor(dependencies) {
    const { exchange, exchangeMarkets } = dependencies;
    this.exchange = exchange;
    this.exchangeMarkets = exchangeMarkets;
  }
  async getOrderBook(instrumentName) {
    const orderBook = await getOrderBook(this.exchange, instrumentName);
    return orderBook;
  }
}
module.exports = OrderBookService;
