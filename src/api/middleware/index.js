const ccxt = require('ccxt');
const { getApiPair, exchangeExists } = require('../../services/general');

const { errorHandler } = require('../../services/errorHandler');
let exchangeMarkets = [];

exports.authenticateAndConnect = async (req, res, next) => {
  try {
    const { accountid } = req.headers;
    const { path } = req;
    const exchangename = path.split('/')[1];
    if (!exchangeExists(exchangename))
      throw {
        message: 'Exchange not found',
        type: 'Invalid Exchange'
      };
    let exchangeOptions;
    if (!accountid)
      throw {
        message: 'Invalid AccountId',
        type: 'Invalid AccountId'
      };
    const apiPair = await getApiPair(exchangename, accountid);
    if (apiPair) {
      const { apiKey, secret } = apiPair;
      exchangeOptions = {
        apiKey,
        secret,
        timeout: 30000,
        enableRateLimit: true,
        urls: {
          api: {
            fapiPublic: 'https://testnet.binancefuture.com/fapi/v1', // ←------  fapi prefix here
            fapiPrivate: 'https://testnet.binancefuture.com/fapi/v1' // ←------  fapi prefix here
          }
        },
        options: {
          defaultType: 'future',
          warnOnFetchOpenOrdersWithoutSymbol: false
        }
      };
    } else {
      exchangeOptions = {
        timeout: 30000,
        enableRateLimit: true,
        urls: {
          api: {
            fapiPublic: 'https://testnet.binancefuture.com/fapi/v1', // ←------  fapi prefix here
            fapiPrivate: 'https://testnet.binancefuture.com/fapi/v1' // ←------  fapi prefix here
          }
        },
        options: {
          defaultType: 'future',
          warnOnFetchOpenOrdersWithoutSymbol: false
        }
      };
    }
    const exchangeClass = ccxt[exchangename],
      exchange = new exchangeClass(exchangeOptions);

    req.exchange = exchange;
    req.apiSet = true;
    next();
  } catch (e) {
    return res.status(500).json(errorHandler(e));
  }
};

// TODO: FAZER ESSE MÉTODO GENÉRICO
// BUSCANDO A EXCHANGE PASSADA NO CAMINHO DA ROTA
exports.loadExchangeMarkets = async (req, res, next) => {
  const { exchange } = req;
  try {
    if (exchangeMarkets.length <= 0) {
      exchangeMarkets = await exchange.loadMarkets();
    }
    req.exchangeMarkets = exchangeMarkets;
    next();
  } catch (e) {
    return res.status(500).json(errorHandler(e));
  }
};

exports.isInstrumentValid = async (req, res, next) => {
  try {
    let instrumentName = req.query.instrumentName || req.body.instrumentName;
    if (!instrumentName || !exchangeMarkets[instrumentName.toUpperCase()]) {
      throw { message: 'Instrument not found', type: 'Invalid Instrument' };
    } else {
      req.instrument = exchangeMarkets[instrumentName.toUpperCase()];
      req.query.instrumentName = instrumentName.toUpperCase();
      req.body.instrumentName = instrumentName.toUpperCase();
      next();
    }
  } catch (e) {
    return res.status(500).json(errorHandler(e));
  }
};
