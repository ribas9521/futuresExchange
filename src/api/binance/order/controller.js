const { errorHandler } = require("../../../services/errorHandler");
const OrderService = require("./service");

exports.createOrder = async (req, res) => {
  try {
    const { exchangeMarkets, exchange, body } = req;
    const orderService = new OrderService({
      exchange,
      exchangeMarkets
    });
    const order = await orderService.createOrder(body);
    return res.status(200).json(order);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};
