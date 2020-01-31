exports.binanceInstrumentParser = symbol => {
  const { id, symbol, info, price, precision } = symbol;
  const { price } = precision;

  const idealSymbol = {
    id,
    symbol,
    tickSize: 1,
    tickSizePrecision: precision,
    
  };
};
