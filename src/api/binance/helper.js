const {
  removeSpecialCharacters,
  getAbsoluteValueByExchange,
  filterType
} = require("../../services/general");
exports.getMarkPrice = async (conn, instrumentName) => {
  const premiumIndex = await conn.fapiPublicGetPremiumIndex({
    symbol: removeSpecialCharacters(instrumentName)
  });
  return premiumIndex.markPrice;
};
exports.getPremiumIndex = async (conn, instrumentName) => {
  const premiumIndex = await conn.fapiPublicGetPremiumIndex({
    symbol: removeSpecialCharacters(instrumentName)
  });
  return premiumIndex;
};

exports.setOrderParams = (order, exchangeMarkets) => {
  let { customId, type, stopPrice, instrumentName, price } = order;
  type = filterType(type);
  return {
    ...(customId && {
      newClientOrderId: customId
    }),
    ...(price && {
      price: getAbsoluteValueByExchange(
        price,
        "price",
        instrumentName,
        exchangeMarkets
      )
    }),
    ...(type === "TAKE_PROFIT" &&
      stopPrice && {
        type,
        stopPrice: getAbsoluteValueByExchange(
          stopPrice,
          "price",
          instrumentName,
          exchangeMarkets
        )
      })
  };
};

exports.shouldUseParams = order => {
  const { type, customId } = order;
  return type === "STOP_LIMIT" ? true : false || customId ? true : false;
};
