const ccxt = require("ccxt");
const {
  numberToString,
  decimalToPrecision,
  TRUNCATE,
  DECIMAL_PLACES,
  NO_PADDING
} = require("ccxt");
exports.getTicker = async (conn, instumentName = null) => {
  let ticker;
  if (instumentName) {
    ticker = await conn.fetchTicker(instumentName);
  } else ticker = await conn.fetchTickers();
  return ticker;
};

exports.fetchBidsAsks = async (conn, instumentName = null) => {
  let bidsAsks;
  if (instumentName) {
    bidsAsks = await conn.fetchBidsAsks([instumentName]);
    bidsAsks = bidsAsks[instumentName];
  } else bidsAsks = await conn.fetchBidsAsks();
  return bidsAsks;
};

exports.getOrderBook = async (conn, instrumentName) => {
  const orderBook = await conn.fetchOrderBook(instrumentName);
  return orderBook;
};

exports.getApiPair = async (exchangeName, accountId) => {
  return {
    apiKey: "37b227b170f61da6696ee83ef81d5225869d2ea16aff1980d546ffafce89a6c7",
    //apiKey: "37b227b170f61da669d2ea16aff1980d546ffafce89a6c7",
    secret: "1fa5a3c4e279c8b179495b606775913b9eafea536f96d3ee3ddc924e5e943d19"
  };
};
exports.exchangeExists = exchangeName => {
  const exchanges = ccxt.exchanges;
  const filtered = exchanges.filter(e => e === exchangeName);
  if (filtered.length === 1) {
    return true;
  }
  return false;
};

exports.countDecimals = value => {
  if (Math.floor(parseFloat(value)) === parseFloat(value)) return 0;
  return value.toString().split(".")[1].length || 0;
};

exports.removeSpecialCharacters = value => {
  return value.toString().replace(/[^\w\s]/gi, "");
};

exports.parseToInt = value => {
  return parseInt(this.removeSpecialCharacters(value));
};

exports.getPrecision = (value, fromOrTo) => {
  if ("from") return Math.pow(10, value);
  else if ("to") return;
};

exports.filterPrice = (price, precision) => {
  return parseFloat(
    decimalToPrecision(
      numberToString(price),
      TRUNCATE,
      precision,
      DECIMAL_PLACES,
      NO_PADDING
    )
  );
};

exports.filterQuantity = (quantity, precision) => {
  return parseFloat(
    decimalToPrecision(
      numberToString(quantity),
      TRUNCATE,
      precision,
      DECIMAL_PLACES,
      NO_PADDING
    )
  );
};

exports.filterSideTo = side => {
  side = side.toUpperCase();
  if (side === "LONG") return "BUY";
  else if (side === "SHORT") return "SELL";
  throw {
    type: "side error ",
    message: "invalid side"
  };
};
exports.filterSidefrom = side => {
  side = side.toUpperCase();
  if (side === "BUY") return "LONG";
  else if (side === "SELL") return "SHORT";
  throw {
    type: "side error ",
    message: "invalid side"
  };
};
exports.filterType = type => {
  type = type.toUpperCase();
  if (type === "LIMIT" || type === "MARKET" || type === "TAKE_PROFIT")
    return type;
  throw {
    type: "type error ",
    message: "invalid type"
  };
};

exports.getAbsoluteValueByExchange = (
  value,
  type,
  instrumentName,
  exchangeMarkets
) => {
  const exchangePrecision = exchangeMarkets[instrumentName].precision;
  let absoluteValue = 0,
    precision = 0;
  if (type === "size") {
    precision = this.getPrecision(exchangePrecision.amount);
  } else if (type === "price") {
    precision = this.getPrecision(exchangePrecision.price);
  }
  absoluteValue = value / precision;
  return absoluteValue;
};

/**
 * Returns the values in form of integer and it's precision
 */
exports.getRelativeValuesAndPrecisionByExchange = (
  value,
  type,
  instrumentName,
  exchangeMarkets,
  precision
) => {
  const exchangePrecision = exchangeMarkets
    ? exchangeMarkets[instrumentName].precision
    : null;
  let relativeValue = 0;
  let relativePrecision = 0;
  if (type === "size") {
    relativePrecision = this.getPrecision(exchangePrecision.amount);
  } else if (type === "price") {
    relativePrecision = this.getPrecision(exchangePrecision.price);
  } else {
    relativePrecision = precision;
  }
  relativeValue = value * relativePrecision;
  return { relativeValue, relativePrecision };
};

exports.getInstrumentId = (instrumentName, exchangeMarkets) =>
  exchangeMarkets[instrumentName].id;

exports.getInstrumentNameFromId = (id, exchangeMarkets) => {
  exchangeMarkets = Object.values(exchangeMarkets);
  return exchangeMarkets.filter(market => market.id === id)[0].symbol;
};

exports.round = (number, places) => {
  return +(Math.round(number + "e+" + places) + "e-" + places);
};
