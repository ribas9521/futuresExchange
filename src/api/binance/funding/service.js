const { getfundingParser } = require("../parser");
const { getInstrumentId } = require("../../../services/general");
const { getPremiumIndex } = require("../helper");
class FundingService {
  constructor(dependencies) {
    const { exchange, exchangeMarkets } = dependencies;
    this.exchange = exchange;
    this.exchangeMarkets = exchangeMarkets;
  }
  async getFunding(instrumentName) {
    const funding = await this.exchange.fapiPublicGetFundingRate({
      symbol: getInstrumentId(instrumentName, this.exchangeMarkets),
      limit: 1
    });
    const premiumIndex = await getPremiumIndex(this.exchange, instrumentName);
    const parsedFunding = getfundingParser(funding[0], premiumIndex);
    return parsedFunding;
  }
}

module.exports = FundingService;
