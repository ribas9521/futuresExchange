const { setLeverageParser, getLeverageParser } = require("../parser");
const PositionService = require("../position/service");
class LeverageService {
  constructor(dependencies) {
    const { exchange, exchangeMarkets } = dependencies;
    this.exchange = exchange;
    this.exchangeMarkets = exchangeMarkets;
  }
  async getLeverage(instrumentName) {
    const positionService = new PositionService({
      exchange: this.exchange,
      exchangeMarkets: this.exchangeMarkets
    });
    const position = await positionService.getPosition(instrumentName);
    const { leverage, leveragePrecision, leverageIsolated } = position;
    return { leverage, leveragePrecision, leverageIsolated };
  }

  async setLeverage(leverageInfo) {
    const { value, instrumentName } = leverageInfo;
    const leverageSet = await this.exchange.fapiPrivatePostLeverage(
      setLeverageParser(value, instrumentName, this.exchangeMarkets)
    );
    // const parsedPosition = getPositionParser(
    //   positions,
    //   instrumentName,
    //   this.exchangeMarkets
    // );
    return getLeverageParser(leverageSet, this.exchangeMarkets);
  }
}

module.exports = LeverageService;
