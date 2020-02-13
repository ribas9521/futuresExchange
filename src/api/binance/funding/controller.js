const { errorHandler } = require("../../../services/errorHandler");
const FundingService = require("./service");

exports.getFunding = async (req, res) => {
  try {
    const { exchangeMarkets, exchange, query } = req;
    const { instrumentName } = query;

    const fundingService = new FundingService({
      exchange,
      exchangeMarkets
    });
    const funding = await fundingService.getFunding(instrumentName);
    return res.status(200).json(funding);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};
