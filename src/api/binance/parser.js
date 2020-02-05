const {
  countDecimals,
  parseToInt,
  getPrecision,
  filterQuantity,
  filterPrice,
  filterSideTo,
  filterSidefrom,
  filterType,
  getRelativeValuesAndPrecisionByExchange
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

exports.createOrderParser = (orderInfo, exchangeMarkets) => {
  let {
    instrumentName,
    customId,
    size,
    price,
    side,
    type,
    stopPrice
  } = orderInfo;
  const symbol = exchangeMarkets[instrumentName].id;
  delete orderInfo.instrumentName;
  orderInfo.symbol = symbol;
  orderInfo.newClientOrderId = customId;
  delete orderInfo.customId;
  const sizePrecision = exchangeMarkets[instrumentName].precision.amount;
  size = parseFloat(size / getPrecision(sizePrecision));
  orderInfo.quantity = filterQuantity(size, sizePrecision);
  delete orderInfo.size;
  let pricePrecision;
  if (price) {
    pricePrecision = exchangeMarkets[instrumentName].precision.price;
    price = parseFloat(price / getPrecision(pricePrecision));
    orderInfo.price = filterPrice(price, pricePrecision);
  }
  side = filterSideTo(side);
  orderInfo.side = side;
  type = filterType(type);
  orderInfo.type = type;
  if (price && type === "TAKE_PROFIT") {
    orderInfo.stopPrice = filterPrice(
      parseFloat(price / getPrecision(pricePrecision), pricePrecision)
    );
  }
  orderInfo.timeInForce = "GTC";
  orderInfo.type === "MARKET" && delete orderInfo.timeInForce;
  return orderInfo;
};

exports.getOrderParser = async (order, exchangeMarkets) => {
  let {
    id,
    info,
    symbol,
    amount,
    price,
    remaining,
    side,
    status,
    timeStamp
  } = order;
  const { clientOrderId, type } = info;
  const sizeAndPrecision = getRelativeValuesAndPrecisionByExchange(
    amount,
    "size",
    symbol,
    exchangeMarkets
  );
  priceAndPrecision = getRelativeValuesAndPrecisionByExchange(
    price,
    "price",
    symbol,
    exchangeMarkets
  );
  const relativeRemaining = getRelativeValuesAndPrecisionByExchange(
    remaining,
    "size",
    symbol,
    exchangeMarkets
  );
  const newOrder = {
    id,
    customId: clientOrderId,
    instrumentName: symbol,
    size: sizeAndPrecision.relativeValue,
    sizePrecision: sizeAndPrecision.relativePrecision,
    price: priceAndPrecision.relativeValue,
    pricePrecision: priceAndPrecision.relativePrecision,
    leftSize: relativeRemaining.relativeValue,
    side: filterSidefrom(side),
    status,
    type,
    timeStamp,
    description: "",
    open: status === "closed" ? false : true
  };
  return newOrder;
};
