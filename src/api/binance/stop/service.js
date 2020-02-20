const { getStopParser } = require('../parser');
const OrderService = require('../order/service');

class StopService {
  constructor(dependencies) {
    const { exchange, exchangeMarkets } = dependencies;
    this.exchange = exchange;
    this.exchangeMarkets = exchangeMarkets;
  }
  async getStops(instrumentName) {
    const orderService = new OrderService({
      exchange: this.exchange,
      exchangeMarkets: this.exchangeMarkets
    });
    const allOrders = await orderService.getAllOrders(instrumentName);
    const allStops = [];
    for (let order of allOrders) {
      allStops.push(getStopParser(order));
    }

    //const parsedOrder = getOrderParser(order, this.exchangeMarkets);
    return allStops;
  }
  async getOpenStops(instrumentName) {
    const orderService = new OrderService({
      exchange: this.exchange,
      exchangeMarkets: this.exchangeMarkets
    });
    const allOrders = await orderService.getAllOpenOrders(instrumentName);
    const allStops = [];
    for (let order of allOrders) {
      allStops.push(getStopParser(order));
    }

    //const parsedOrder = getOrderParser(order, this.exchangeMarkets);
    return allStops;
  }
}

module.exports = StopService;
