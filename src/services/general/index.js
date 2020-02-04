const ccxt = require("ccxt");
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
  if (!instrumentName) {
    throw {
      type: "invalid instrument name",
      message: "instrument name required"
    };
  }
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

exports.getPrecision = power => {
  return Math.pow(10, power);
};
