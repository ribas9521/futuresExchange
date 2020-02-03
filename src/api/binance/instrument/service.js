const {
  instrumentInfoParser,
  priceInfoParser,
  feeInfoParser
} = require("../parser");
const { fees } = require("../variables");

const { getMarkPrice } = require("../helper");

const { getTicker, fetchBidsAsks } = require("../../../services/general");

class InstrumentService {
  constructor(dependencies) {
    const { exchange, exchangeMarkets } = dependencies;
    this.exchange = exchange;
    this.exchangeMarkets = exchangeMarkets;
  }

  getInstrumentInfo(instrumentName) {
    const parsedTicker = instrumentInfoParser(
      this.exchangeMarkets[instrumentName]
    );
    const resp = { ...parsedTicker, ...{ maxLeverage: 125 } };
    return resp;
  }

  getInstruments() {
    const allInstruments = [];
    for (let instrument in this.exchangeMarkets) {
      allInstruments.push(instrument);
    }
    return allInstruments;
  }

  async getPriceInfo(instrument) {
    const ticker = await getTicker(this.exchange, instrument.symbol);
    const bidsAsks = await fetchBidsAsks(this.exchange, instrument.symbol);
    const markPrice = await getMarkPrice(this.exchange, instrument.symbol);
    const priceInfo = priceInfoParser(instrument, ticker, bidsAsks, markPrice);
    return priceInfo;
  }
  getFeeInfo() {
    return fees.futures;
  }
}
module.exports = InstrumentService;
