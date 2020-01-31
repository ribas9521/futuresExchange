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
