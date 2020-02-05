const { createOrderParser, getOrderParser } = require("../parser");

class OrderService {
  constructor(dependencies) {
    const { exchange, exchangeMarkets } = dependencies;
    this.exchange = exchange;
    this.exchangeMarkets = exchangeMarkets;
  }
  async createOrder(orderInfo) {
    const parsedOrder = createOrderParser(orderInfo, this.exchangeMarkets);
    const order = await this.exchange.fapiPrivatePostOrder(parsedOrder);
    return order;
  }
  async getOrder(orderId, instrumentName) {
    const order = await this.exchange.fetchOrder(orderId, instrumentName);
    const parsedOrder = getOrderParser(order, this.exchangeMarkets);
    return parsedOrder;
  }
  async cancelOrder(orderId, instrumentName) {
    const canceledOrder = await this.exchange.cancelOrder(
      orderId,
      instrumentName
    );
    //const parsedOrder = getOrderParser(order, this.exchangeMarkets);
    return getOrderParser(canceledOrder, this.exchangeMarkets);
  }
}

module.exports = OrderService;
