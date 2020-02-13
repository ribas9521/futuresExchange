const { getBalanceParser } = require("../parser");
const { getMarkPrice } = require("../helper");

class AccountService {
  constructor(dependencies) {
    const { exchange, exchangeMarkets } = dependencies;
    this.exchange = exchange;
    this.exchangeMarkets = exchangeMarkets;
  }
  async getBalance() {
    const balance = await this.exchange.fetchBalance();
    const markPrice = await getMarkPrice(this.exchange, "BTC/USDT");
    const parsedBalance = getBalanceParser(balance, markPrice);

    return parsedBalance;
  }
}

module.exports = AccountService;
