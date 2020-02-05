const { orderParser } = require("../parser");

class OrderService {
  constructor(dependencies) {
    const { exchange, exchangeMarkets } = dependencies;
    this.exchange = exchange;
    this.exchangeMarkets = exchangeMarkets;
  }
  async createOrder(orderInfo) {
    const parsedOrder = orderParser(orderInfo, this.exchangeMarkets);
    const order = await this.exchange.fapiPrivatePostOrder(parsedOrder);
    return order;
  }
}

module.exports = OrderService;
