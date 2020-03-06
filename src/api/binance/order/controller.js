const { errorHandler } = require('../../../services/errorHandler');
const OrderService = require('./service');

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
exports.getAllOrders = async (req, res) => {
  try {
    const { exchangeMarkets, exchange, query } = req;
    const { instrumentName } = query;

    const orderService = new OrderService({
      exchange,
      exchangeMarkets
    });
    const order = await orderService.getAllOrders(instrumentName);
    return res.status(200).json(order);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};
exports.getAllOpenOrders = async (req, res) => {
  try {
    const { exchangeMarkets, exchange, query } = req;
    const { instrumentName } = query;

    const orderService = new OrderService({
      exchange,
      exchangeMarkets
    });
    const order = await orderService.getAllOpenOrders(instrumentName);
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
      instrumentName,
      orderId
    );
    return res.status(200).json(canceledOrder);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { exchangeMarkets, exchange, body } = req;
    const orderService = new OrderService({
      exchange,
      exchangeMarkets
    });
    const order = await orderService.updateOrder(body);
    return res.status(200).json(order);
  } catch (e) {
    const error = errorHandler(e);
    return res.status(500).json(error);
  }
};

exports.cancelAllOrders = async (req, res) => {
  const { exchangeMarkets, exchange, query } = req;
  const { instrumentName } = query;

  const orderService = new OrderService({
    exchange,
    exchangeMarkets
  });
  try {
    const canceledOrder = await orderService.cancelAllOrders(instrumentName);
    return res.status(200).json(canceledOrder);
  } catch (e) {
    const error = errorHandler(e);
    if (orderService.cancelAllOrdersSucced(e)) return res.status(200).json({});
    return res.status(500).json(error);
  }
};
