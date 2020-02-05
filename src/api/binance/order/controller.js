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

exports.getOrder = async (req, res) => {
  try {
    const { exchangeMarkets, exchange, query } = req;
    const { orderId, instrumentName } = query;

    const orderService = new OrderService({
      exchange,
      exchangeMarkets
    });
    const order = await orderService.getOrder(orderId, instrumentName);
    return res.status(200).json(order);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { exchangeMarkets, exchange, query } = req;
    const { orderId, instrumentName } = query;

    const orderService = new OrderService({
      exchange,
      exchangeMarkets
    });
    const canceledOrder = await orderService.cancelOrder(
      orderId,
      instrumentName
    );
    return res.status(200).json(canceledOrder);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};
