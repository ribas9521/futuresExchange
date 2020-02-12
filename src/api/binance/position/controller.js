const { errorHandler } = require("../../../services/errorHandler");
const PositionService = require("./service");

exports.getPosition = async (req, res) => {
  try {
    const { exchangeMarkets, exchange, query } = req;
    const { instrumentName } = query;

    const positionService = new PositionService({
      exchange,
      exchangeMarkets
    });
    const position = await positionService.getPosition(instrumentName);
    return res.status(200).json(position);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};
