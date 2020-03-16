const {
  countDecimals,
  parseToInt,
  getPrecision,
  filterQuantity,
  filterPrice,
  filterSideTo,
  filterSidefrom,
  filterType,
  getRelativeValuesAndPrecisionByExchange,
  getAbsoluteValueByExchange,
  getInstrumentNameFromId,
  round
} = require('../../services/general');

const { setOrderParams, shouldUseParams } = require('./helper');
const { getInstrumentId } = require('../../services/general');

const variables = require('./variables');

exports.instrumentInfoParser = instrumentTicker => {
  const { info } = instrumentTicker;
  const { filters } = info;
  const priceInfoTicker = filters.filter(
    f => f.filterType === 'PRICE_FILTER'
  )[0];
  if (!priceInfoTicker) throw new Error('Price filter not found');

  const amountInfoTicker = filters.filter(f => f.filterType === 'LOT_SIZE')[0];
  if (!amountInfoTicker) throw new Error('Amount filter not found');

  const amountMarketInfoTicker = filters.filter(
    f => f.filterType === 'MARKET_LOT_SIZE'
  )[0];
  if (!amountMarketInfoTicker)
    throw new Error('Amount market filter not found');

  return {
    priceTickSize:
      priceInfoTicker.tickSize *
      Math.pow(10, countDecimals(priceInfoTicker.tickSize)),
    priceTickPrecision: Math.pow(10, countDecimals(priceInfoTicker.tickSize)),
    limitTickSize:
      amountInfoTicker.stepSize *
      Math.pow(10, countDecimals(amountInfoTicker.stepSize)),
    limitTickPrecision: Math.pow(10, countDecimals(amountInfoTicker.stepSize)),
    marketTickSize:
      amountMarketInfoTicker.stepSize *
      Math.pow(10, countDecimals(amountMarketInfoTicker.stepSize)),
    marketTickPrecision: Math.pow(
      10,
      countDecimals(amountMarketInfoTicker.stepSize)
    )
  };
};

exports.priceInfoParser = (
  instrument,
  ticker,
  bidsAsks,
  markPrice,
  exchangeMarkets
) => {
  const currentPrice = getRelativeValuesAndPrecisionByExchange(
    ticker.last,
    'price',
    instrument.symbol,
    exchangeMarkets
  );
  const bidPrice = getRelativeValuesAndPrecisionByExchange(
    bidsAsks.bid,
    'price',
    instrument.symbol,
    exchangeMarkets
  );
  const askPrice = getRelativeValuesAndPrecisionByExchange(
    bidsAsks.ask,
    'price',
    instrument.symbol,
    exchangeMarkets
  );
  const currentMarkPrice = getRelativeValuesAndPrecisionByExchange(
    bidsAsks.ask,
    null,
    instrument.symbol,
    exchangeMarkets,
    getPrecision(8)
  );
  const priceInfo = {
    currentPrice: currentPrice.relativeValue,
    currentMarkPrice: currentMarkPrice.relativeValue,
    pricePrecision: currentPrice.relativePrecision,
    markPricePrecision: currentMarkPrice.relativePrecision,
    bidPrice: bidPrice.relativeValue,
    askPrice: askPrice.relativeValue
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

exports.createOrderParser = (order, exchangeMarkets) => {
  let { instrumentName, size, price, side, type, timeStamp } = order;

  const params = setOrderParams(order, exchangeMarkets);

  const newOrder = {
    symbol: instrumentName,
    side: filterSideTo(side),
    amount: getAbsoluteValueByExchange(
      size,
      'size',
      instrumentName,
      exchangeMarkets
    ),
    ...(price && {
      price: getAbsoluteValueByExchange(
        price,
        'price',
        instrumentName,
        exchangeMarkets
      )
    }),
    type: filterType(type),
    timeStamp,
    ...(shouldUseParams(order) && {
      params
    })
  };
  return newOrder;
};

exports.getOrderParser = (order, exchangeMarkets) => {
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
  const { clientOrderId, type, stopPrice } = info;
  const sizeAndPrecision = getRelativeValuesAndPrecisionByExchange(
    amount,
    'size',
    symbol,
    exchangeMarkets
  );
  priceAndPrecision = getRelativeValuesAndPrecisionByExchange(
    price,
    'price',
    symbol,
    exchangeMarkets
  );
  const relativeRemaining = getRelativeValuesAndPrecisionByExchange(
    remaining,
    'size',
    symbol,
    exchangeMarkets
  );
  if (stopPrice)
    relativeStopPrice = getRelativeValuesAndPrecisionByExchange(
      stopPrice,
      'price',
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
    description: '',
    open: status === 'closed' ? false : true,
    ...(stopPrice && {
      stopPrice: relativeStopPrice.relativeValue
    })
  };
  return newOrder;
};

exports.getPositionParser = (positions, instrumentName, exchangeMarkets) => {
  const position = positions.filter(p => {
    return p.symbol === getInstrumentId(instrumentName, exchangeMarkets);
  })[0];

  let {
    positionAmt,
    entryPrice,
    leverage,
    unRealizedProfit,
    marginType
  } = position;
  const sizeAndPrecision = getRelativeValuesAndPrecisionByExchange(
    positionAmt,
    'size',
    instrumentName,
    exchangeMarkets
  );

  const size = sizeAndPrecision.relativeValue;
  const sizePrecision = sizeAndPrecision.relativePrecision;
  const balanceUsed = (positionAmt / leverage) * entryPrice;
  const balanceUsedAndPrecision = getRelativeValuesAndPrecisionByExchange(
    balanceUsed,
    'price',
    instrumentName,
    exchangeMarkets
  );
  const pnl =
    round((unRealizedProfit / entryPrice / (positionAmt / leverage)) * 100, 3) *
    variables.position.pnlPrecision;
  const pnlPrecision = variables.position.pnlPrecision;
  const relativeLeverage = leverage * variables.leverage.precision;
  const leveragePrecision = variables.leverage.precision;
  const leverageIsolated = marginType === 'isolated' ? true : false;
  return {
    size,
    sizePrecision,
    balanceUsed: balanceUsedAndPrecision.relativeValue,
    balanceUsedPrecision: balanceUsedAndPrecision.relativePrecision,
    pnl,
    pnlPrecision,
    leverage: relativeLeverage,
    leveragePrecision,
    leverageIsolated
  };
};

exports.setLeverageParser = (value, instrumentName, exchangeMarkets) => {
  return {
    leverage: value,
    symbol: getInstrumentId(instrumentName, exchangeMarkets)
  };
};
exports.getLeverageParser = (leverageInfo, exchangeMarkets) => {
  const { leverage, symbol } = leverageInfo;
  const {
    relativeValue,
    relativePrecision
  } = getRelativeValuesAndPrecisionByExchange(
    leverage,
    null,
    null,
    null,
    variables.leverage.precision
  );
  return {
    leverage: relativeValue,
    leveragePrecision: relativePrecision,
    instrumentName: getInstrumentNameFromId(symbol, exchangeMarkets)
  };
};

exports.getBalanceParser = (balance, markPrice) => {
  const { USDT } = balance;
  const { free, total } = USDT;
  const balancePrecision = variables.balance.precision;
  const btcTotal = parseInt(round(total / markPrice, 8) * balancePrecision);
  const btcAvailable = round(free / markPrice, 8) * balancePrecision;
  return {
    total: btcTotal,
    available: btcAvailable,
    used: btcTotal - btcAvailable,
    precision: balancePrecision
  };
};

exports.getOrderBookParser = (orderbook, exchangeMarkets, instrumentName) => {
  const { bids, asks } = orderbook;
  const valueAndPrecisionPrice = getRelativeValuesAndPrecisionByExchange(
    bids[0][0],
    'price',
    instrumentName,
    exchangeMarkets
  );
  const valueAndPrecisionSize = getRelativeValuesAndPrecisionByExchange(
    bids[0][1],
    'size',
    instrumentName,
    exchangeMarkets
  );
  pricePrecision = valueAndPrecisionPrice.relativePrecision;
  sizePrecision = valueAndPrecisionSize.relativePrecision;
  let long = [],
    short = [];
  for (let bid of bids) {
    long.push({
      price: bid[0] * pricePrecision,
      size: bid[1] * sizePrecision,
      pricePrecision,
      sizePrecision
    });
  }
  for (let ask of asks) {
    short.push({
      price: ask[0] * pricePrecision,
      size: ask[1] * sizePrecision,
      pricePrecision,
      sizePrecision
    });
  }

  return { long, short };
};

exports.getfundingParser = (funding, premiumIndex) => {
  const { nextFundingTime } = premiumIndex;
  const { fundingRate } = funding;
  const fundingRatePrecision = variables.funding.precision;

  return {
    nextFunding: nextFundingTime / 1000,
    fundingRate: fundingRate * fundingRatePrecision,
    fundingRatePrecision
  };
};

exports.getStopParser = order => {
  const { stopPrice, pricePrecision } = order;
  return {
    stopPrice,
    stopPrecision: pricePrecision
  };
};
