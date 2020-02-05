const { removeSpecialCharacters } = require("../../services/general");
exports.getMarkPrice = async (conn, instrumentName) => {
  const premiumIndex = await conn.fapiPublicGetPremiumIndex({
    symbol: removeSpecialCharacters(instrumentName)
  });
  return premiumIndex.markPrice;
};