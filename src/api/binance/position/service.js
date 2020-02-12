const { getPositionParser } = require("../parser");

class PositionService {
  constructor(dependencies) {
    const { exchange, exchangeMarkets } = dependencies;
    this.exchange = exchange;
    this.exchangeMarkets = exchangeMarkets;
  }
  async getPosition(instrumentName) {
    const positions = await this.exchange.fapiPrivateGetPositionRisk();
    const parsedPosition = getPositionParser(
      positions,
      instrumentName,
      this.exchangeMarkets
    );
    //const parsedOrder = getOrderParser(order, this.exchangeMarkets);
    return parsedPosition;
  }
}

module.exports = PositionService;
