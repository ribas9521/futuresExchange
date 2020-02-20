const { createOrderParser, getOrderParser } = require('../parser');
const { getInstrumentId } = require('../../../services/general');

class OrderService {
  constructor(dependencies) {
    const { exchange, exchangeMarkets } = dependencies;
    this.exchange = exchange;
    this.exchangeMarkets = exchangeMarkets;
  }
  async createOrder(orderInfo) {
    const {
      symbol,
      side,
      amount,
      price,
      type,
      timeStamp,
      params
    } = createOrderParser(orderInfo, this.exchangeMarkets);
    const order = await this.exchange.createOrder(
      symbol,
      type,
      side,
      amount,
      price,
      params
    );
    return getOrderParser(order, this.exchangeMarkets);
  }
  async getOrder(orderId, instrumentName) {
    const order = await this.exchange.fetchOrder(orderId, instrumentName);
    const parsedOrder = getOrderParser(order, this.exchangeMarkets);
    return parsedOrder;
  }
  async getAllOrders(instrumentName) {
    const orders = await this.exchange.fetchOrders(instrumentName);
    const orderList = [];
    for (let order of orders) {
      const parsedOrder = getOrderParser(order, this.exchangeMarkets);
      orderList.push(parsedOrder);
    }
    return orderList;
  }
  async getAllOpenOrders(instrumentName) {
    const orders = await this.exchange.fetchOpenOrders(instrumentName);
    const orderList = [];
    for (let order of orders) {
      const parsedOrder = getOrderParser(order, this.exchangeMarkets);
      orderList.push(parsedOrder);
    }
    return orderList;
  }
  async cancelOrder(instrumentName) {
    const canceledOrder = await this.exchange.cancelOrder(
      orderId,
      instrumentName
    );
    //const parsedOrder = getOrderParser(order, this.exchangeMarkets);
    return getOrderParser(canceledOrder, this.exchangeMarkets);
  }
  async cancelAllOrders(instrumentName) {
    const canceledOrders = await this.exchange.fapiPrivateDeleteAllOpenOrders({
      symbol: getInstrumentId(instrumentName, this.exchangeMarkets)
    });

    //const parsedOrder = getOrderParser(order, this.exchangeMarkets);
    return canceledOrders;
  }
  async updateOrder(orderInfo) {
    const { orderId, instrumentName } = orderInfo;
    await this.cancelOrder(orderId, instrumentName);
    const createdOrder = await this.createOrder(orderInfo);
    return createdOrder;
  }
}

module.exports = OrderService;
