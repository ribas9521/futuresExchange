const ccxt = require("ccxt");
exports.errorHandler = e => {
  console.log(e);
  if (e instanceof ccxt.NetworkError) {
    return {
      type: "Network Error",
      message: e.message
    };
  } else if (e instanceof ccxt.ExchangeError) {
    return {
      type: "Exchange error",
      message: e.message
    };
  } else {
    return {
      type: e.type ? e.type : "Unknow",
      message: e.message
    };
  }
};
