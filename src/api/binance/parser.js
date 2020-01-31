const {
  countDecimals,
  parseToInt,
  getPrecision
} = require("../../services/general");
exports.instrumentInfoParser = instrumentTicker => {
  const { info } = instrumentTicker;
  const { filters } = info;
  const priceInfoTicker = filters.filter(
    f => f.filterType === "PRICE_FILTER"
  )[0];
  if (!priceInfoTicker) throw new Error("Price filter not found");

  const amountInfoTicker = filters.filter(f => f.filterType === "LOT_SIZE")[0];
  if (!amountInfoTicker) throw new Error("Amount filter not found");

  const amountMarketInfoTicker = filters.filter(
    f => f.filterType === "MARKET_LOT_SIZE"
  )[0];
  if (!amountMarketInfoTicker)
    throw new Error("Amount market filter not found");

  return {
    priceTickSize:
      priceInfoTicker.tickSize *
      Math.pow(10, countDecimals(priceInfoTicker.tickSize)),
    priceTickPrecision: Math.pow(10, countDecimals(priceInfoTicker.tickSize)),
    amountLimitTickSize:
      amountInfoTicker.stepSize *
      Math.pow(10, countDecimals(amountInfoTicker.stepSize)),
    amountLimitTickPrecision: Math.pow(
      10,
      countDecimals(amountInfoTicker.stepSize)
    ),
    amountMarketTickSize:
      amountMarketInfoTicker.stepSize *
      Math.pow(10, countDecimals(amountMarketInfoTicker.stepSize)),
    amountMarketTickPrecision: Math.pow(
      10,
      countDecimals(amountMarketInfoTicker.stepSize)
    )
  };
};

exports.priceInfoParser = (instrument, ticker, bidsAsks, markPrice) => {
  const priceInfo = {
    currentPrice: parseToInt(ticker.last),
    currentMarkPrice: parseToInt(markPrice),
    pricePrecision: getPrecision(instrument.precision.price),
    markPricePrecision: getPrecision(8),
    bidPrice: parseToInt(bidsAsks.bid),
    askPrice: parseToInt(bidsAsks.ask)
  };
  return priceInfo;
};

exports.feeInfoParser = instrument => {
  const feeInfo = {
    takerFee: parseToInt(instrument.taker),
    makerFee: parseToInt(instrument.maker),
    feePrecision: 1000
  };
  return feeInfo;
};
