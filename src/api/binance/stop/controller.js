const { errorHandler } = require('../../../services/errorHandler');
const StopService = require('./service');

exports.getStops = async (req, res) => {
  try {
    const { exchangeMarkets, exchange, query } = req;
    const { instrumentName } = query;

    const stopService = new StopService({
      exchange,
      exchangeMarkets
    });
    const stop = await stopService.getStops(instrumentName);
    return res.status(200).json(stop);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};
exports.getOpenStops = async (req, res) => {
  try {
    const { exchangeMarkets, exchange, query } = req;
    const { instrumentName } = query;

    const stopService = new StopService({
      exchange,
      exchangeMarkets
    });
    const stop = await stopService.getOpenStops(instrumentName);
    return res.status(200).json(stop);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};
