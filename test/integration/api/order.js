const chai = require('chai'),
  chaiHttp = require('chai-http');
const expect = chai.expect;
let server = require('../../../src/app');
let market = 'BTC/USDT';

chai.use(chaiHttp);

const getInstrumentPriceInfo = ({ instrumentName }) =>
  chai
    .request(server)
    .get('/api/binance/instrument/price')
    .set('accountId', 'test')
    .query({ instrumentName });

const cancelOrder = ({ instrumentName, orderId }) =>
  chai
    .request(server)
    .delete('/api/binance/order')
    .set('Accept', 'application/json')
    .set('accountId', 'test')
    .query({ instrumentName, orderId });

const cancelAllOrders = ({ instrumentName }) =>
  chai
    .request(server)
    .post('/api/binance/order/cancel/all')
    .set('Accept', 'application/json')
    .set('accountId', 'test')
    .query({ instrumentName });

const getOrderById = ({ instrumentName, orderId }) =>
  chai
    .request(server)
    .get('/api/binance/order')
    .set('Accept', 'application/json')
    .set('accountId', 'test')
    .query({ instrumentName, orderId });

const getAllOrders = ({ instrumentName }) =>
  chai
    .request(server)
    .get('/api/binance/order/all')
    .set('Accept', 'application/json')
    .set('accountId', 'test')
    .query({ instrumentName });

const getOpenOrders = ({ instrumentName }) =>
  chai
    .request(server)
    .get('/api/binance/order/open')
    .set('Accept', 'application/json')
    .set('accountId', 'test')
    .query({ instrumentName });

const getAllInstruments = async () =>
  chai
    .request(server)
    .get('/api/binance/instrument/all')
    .set('Accept', 'application/json')
    .set('accountId', 'test');

const getInstrumentInfo = async ({ instrumentName }) =>
  chai
    .request(server)
    .get('/api/binance/instrument/info')
    .set('accountId', 'test')
    .query({ instrumentName });

const updateOrder = async ({
  instrumentName,
  orderId,
  customId,
  size,
  side,
  type,
  price,
  stopPrice
}) =>
  chai
    .request(server)
    .put('/api/binance/order')
    .set('accountId', 'test')
    .query({ orderId })
    .send({
      orderId,
      instrumentName,
      ...(price && {
        price
      }),
      ...(customId && {
        customId
      }),
      ...(stopPrice && {
        stopPrice
      }),
      size,
      side,
      type
    });

const createOrder = ({
  instrumentName,
  customId,
  size,
  side,
  type,
  price,
  stopPrice
}) =>
  chai
    .request(server)
    .post('/api/binance/order')
    .set('Accept', 'application/json')
    .set('accountId', 'test')
    .send({
      instrumentName,
      ...(price && {
        price
      }),
      ...(customId && {
        customId
      }),
      ...(stopPrice && {
        stopPrice
      }),
      size,
      side,
      type
    });

describe('api', () => {
  let priceInfo;
  let marketInfo;
  let instrumentInfo;
  before(async () => {
    priceInfo = await getInstrumentPriceInfo({ instrumentName: market });
    expect(priceInfo).to.have.status(200);
    instrumentInfo = await getInstrumentInfo({ instrumentName: market });
    expect(instrumentInfo).to.have.status(200);

    // marketInfo = await getAllInstruments();
    // expect(marketInfo).to.have.status(200);
  });

  describe('/binance', () => {
    describe('/order', () => {
      describe('/post', () => {
        it('should post a LIMIT SHORT with CUSTOMID, SIZE 1 and PRICE = MARKET + 10% order and cancel it', async () => {
          const post = await createOrder({
            instrumentName: market,
            customId: 'ordertestId',
            size: 1000,
            price: Math.round(priceInfo.body.currentPrice * 1.1),
            type: 'LIMIT',
            side: 'SHORT'
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.customId).to.be.equal('ordertestId');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('SHORT');
          expect(post.body.type).to.be.equal('LIMIT');
          expect(post.body.instrumentName).to.be.equal(market);
          expect(post.body.price).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.1)
          );
          const orderId = post.body.id;
          const deletion = await cancelOrder({
            instrumentName: market,
            orderId
          });
          expect(deletion).to.have.status(200);
        });

        it('should post a LIMIT LONG with CUSTOMID, SIZE 1 and PRICE = MARKET - 10% order and cancel it', async () => {
          const post = await createOrder({
            instrumentName: market,
            customId: 'ordertestId',
            size: 1000,
            price: Math.round(priceInfo.body.currentPrice * 0.9),
            type: 'LIMIT',
            side: 'LONG'
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.customId).to.be.equal('ordertestId');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('LONG');
          expect(post.body.type).to.be.equal('LIMIT');
          expect(post.body.instrumentName).to.be.equal(market);
          expect(post.body.price).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 0.9)
          );
          const orderId = post.body.id;
          const deletion = await cancelOrder({
            instrumentName: market,
            orderId
          });
          expect(deletion).to.have.status(200);
        });

        it('should post a TAKE_PROFIT SHORT with CUSTOM ID, SIZE 1 and PRICE = MARKET + 10%  and cancel it', async () => {
          const post = await createOrder({
            instrumentName: market,
            customId: 'ordertestId2',
            size: 1000,
            price: Math.round(priceInfo.body.currentPrice * 1.1),
            type: 'TAKE_PROFIT',
            side: 'SHORT',
            stopPrice: Math.round(priceInfo.body.currentPrice * 1.15)
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.customId).to.be.equal('ordertestId2');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('SHORT');
          expect(post.body.type).to.be.equal('TAKE_PROFIT');
          expect(post.body.instrumentName).to.be.equal(market);
          expect(post.body.price).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.1)
          );
          expect(post.body.stopPrice).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.15)
          );
          const orderId = post.body.id;
          const deletion = await cancelOrder({
            instrumentName: market,
            orderId
          });
          expect(deletion).to.have.status(200);
        });

        it('should post a TAKE_PROFIT LONG with CUSTOM ID, SIZE 1 and PRICE = MARKET - 10%  and cancel it', async () => {
          const post = await createOrder({
            instrumentName: market,
            customId: 'ordertestId2',
            size: 1000,
            price: Math.round(priceInfo.body.currentPrice * 0.9),
            type: 'TAKE_PROFIT',
            side: 'LONG',
            stopPrice: Math.round(priceInfo.body.currentPrice * 0.85)
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.customId).to.be.equal('ordertestId2');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('LONG');
          expect(post.body.type).to.be.equal('TAKE_PROFIT');
          expect(post.body.instrumentName).to.be.equal(market);
          expect(post.body.price).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 0.9)
          );
          expect(post.body.stopPrice).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 0.85)
          );
          const orderId = post.body.id;
          const deletion = await cancelOrder({
            instrumentName: market,
            orderId
          });
          expect(deletion).to.have.status(200);
        });

        it('should post a TAKE_PROFIT_MARKET SHORT with CUSTOM ID, SIZE 1 and PRICE = MARKET + 10%  and cancel it', async () => {
          const post = await createOrder({
            instrumentName: market,
            customId: 'ordertestId2',
            size: 1000,
            type: 'TAKE_PROFIT_MARKET',
            side: 'SHORT',
            stopPrice: Math.round(priceInfo.body.currentPrice * 1.15)
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.customId).to.be.equal('ordertestId2');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('SHORT');
          expect(post.body.type).to.be.equal('TAKE_PROFIT_MARKET');
          expect(post.body.instrumentName).to.be.equal(market);

          expect(post.body.stopPrice).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.15)
          );
          const orderId = post.body.id;
          const deletion = await cancelOrder({
            instrumentName: market,
            orderId
          });
          expect(deletion).to.have.status(200);
        });

        it('should post a TAKE_PROFIT_MARKET LONG with CUSTOM ID, SIZE 1 and PRICE = MARKET - 10%  and cancel it', async () => {
          const post = await createOrder({
            instrumentName: market,
            customId: 'ordertestId2',
            size: 1000,
            type: 'TAKE_PROFIT_MARKET',
            side: 'LONG',
            stopPrice: Math.round(priceInfo.body.currentPrice * 0.85)
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.customId).to.be.equal('ordertestId2');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('LONG');
          expect(post.body.type).to.be.equal('TAKE_PROFIT_MARKET');
          expect(post.body.instrumentName).to.be.equal(market);

          expect(post.body.stopPrice).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 0.85)
          );
          const orderId = post.body.id;
          const deletion = await cancelOrder({
            instrumentName: market,
            orderId
          });
          expect(deletion).to.have.status(200);
        });
        it('should post a STOP SHORT with CUSTOM ID, SIZE 1 and PRICE = MARKET + 10%  and cancel it', async () => {
          const post = await createOrder({
            instrumentName: market,
            customId: 'ordertestId2',
            size: 1000,
            price: Math.round(priceInfo.body.currentPrice * 1.1),
            type: 'STOP',
            side: 'SHORT',
            stopPrice: Math.round(priceInfo.body.currentPrice * 1.15)
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.customId).to.be.equal('ordertestId2');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('SHORT');
          expect(post.body.type).to.be.equal('STOP');
          expect(post.body.instrumentName).to.be.equal(market);
          expect(post.body.price).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.1)
          );
          expect(post.body.stopPrice).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.15)
          );
          const orderId = post.body.id;
          const deletion = await cancelOrder({
            instrumentName: market,
            orderId
          });
          expect(deletion).to.have.status(200);
        });
        it('should post a STOP LONG with CUSTOM ID, SIZE 1 and PRICE = MARKET - 10%  and cancel it', async () => {
          const post = await createOrder({
            instrumentName: market,
            customId: 'ordertestId2',
            size: 1000,
            price: Math.round(priceInfo.body.currentPrice * 0.9),
            type: 'STOP',
            side: 'LONG',
            stopPrice: Math.round(priceInfo.body.currentPrice * 0.85)
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.customId).to.be.equal('ordertestId2');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('LONG');
          expect(post.body.type).to.be.equal('STOP');
          expect(post.body.instrumentName).to.be.equal(market);
          expect(post.body.price).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 0.9)
          );
          expect(post.body.stopPrice).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 0.85)
          );
          const orderId = post.body.id;
          const deletion = await cancelOrder({
            instrumentName: market,
            orderId
          });
          expect(deletion).to.have.status(200);
        });
        it('should post a STOP_MARKET SHORT with CUSTOM ID, SIZE 1 and PRICE = MARKET - 10%  and cancel it', async () => {
          const post = await createOrder({
            instrumentName: market,
            customId: 'ordertestId2',
            size: 1000,
            type: 'STOP_MARKET',
            side: 'SHORT',
            stopPrice: Math.round(priceInfo.body.currentPrice * 0.85)
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.customId).to.be.equal('ordertestId2');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('SHORT');
          expect(post.body.type).to.be.equal('STOP_MARKET');
          expect(post.body.instrumentName).to.be.equal(market);

          expect(post.body.stopPrice).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 0.85)
          );
          const orderId = post.body.id;
          const deletion = await cancelOrder({
            instrumentName: market,
            orderId
          });
          expect(deletion).to.have.status(200);
        });
        it('should post a STOP_MARKET LONG with CUSTOM ID, SIZE 1 and PRICE = MARKET + 10%  and cancel it', async () => {
          const post = await createOrder({
            instrumentName: market,
            customId: 'ordertestId2',
            size: 1000,
            type: 'STOP_MARKET',
            side: 'LONG',
            stopPrice: Math.round(priceInfo.body.currentPrice * 1.15)
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.customId).to.be.equal('ordertestId2');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('LONG');
          expect(post.body.type).to.be.equal('STOP_MARKET');
          expect(post.body.instrumentName).to.be.equal(market);

          expect(post.body.stopPrice).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.15)
          );
          const orderId = post.body.id;
          const deletion = await cancelOrder({
            instrumentName: market,
            orderId
          });
          expect(deletion).to.have.status(200);
        });
        it(`should post a MARKET LONG with CUSTOM ID, SIZE 1
       then create an MARKET SHORT with size 1`, async () => {
          const post = await createOrder({
            instrumentName: market,
            customId: 'ordertestId2',
            size: 1000,
            type: 'MARKET',
            side: 'LONG'
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.customId).to.be.equal('ordertestId2');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('LONG');
          expect(post.body.type).to.be.equal('MARKET');
          expect(post.body.instrumentName).to.be.equal(market);

          const cancel = await createOrder({
            instrumentName: market,
            customId: 'ordertestId2',
            size: 1000,
            type: 'MARKET',
            side: 'SHORT'
          });
          expect(cancel).to.have.status(200);
        });
        it(`should post a MARKET SHORT with CUSTOM ID, SIZE 1
       then create an MARKET LONG with size 1`, async () => {
          const post = await createOrder({
            instrumentName: market,
            customId: 'ordertestId2',
            size: 1000,
            type: 'MARKET',
            side: 'SHORT'
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.customId).to.be.equal('ordertestId2');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('SHORT');
          expect(post.body.type).to.be.equal('MARKET');
          expect(post.body.instrumentName).to.be.equal(market);

          const cancel = await createOrder({
            instrumentName: market,
            customId: 'ordertestId2',
            size: 1000,
            type: 'MARKET',
            side: 'LONG'
          });
          expect(cancel).to.have.status(200);
        });
        it(`should fail to post a MARKET SHORT with SIZE 0
       then create an MARKET LONG with size 1`, async () => {
          const post = await createOrder({
            instrumentName: market,
            size: 0,
            type: 'MARKET',
            side: 'SHORT'
          });
          expect(post).to.have.status(500);
          expect(post).to.have.property('body');
          expect(post.body).to.have.property('type');
          expect(post.body).to.have.property('message');
        });
      });
      describe('/get', () => {
        it('should post an order and get it by ID then delete it', async () => {
          const post = await createOrder({
            instrumentName: market,
            customId: 'testid55',
            size: 1000,
            price: Math.round(priceInfo.body.currentPrice * 1.1),
            type: 'LIMIT',
            side: 'SHORT'
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.customId).to.be.equal('testid55');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('SHORT');
          expect(post.body.type).to.be.equal('LIMIT');
          expect(post.body.instrumentName).to.be.equal(market);
          expect(post.body.price).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.1)
          );
          const orderId = post.body.id;

          const get = await getOrderById({ instrumentName: market, orderId });
          expect(get).to.have.status(200);
          expect(get).to.have.property('body');
          expect(get.body.customId).to.be.equal('testid55');
          expect(get.body.id).to.be.equal(orderId);
          expect(get.body.size).to.be.equal(1000);
          expect(get.body.sizePrecision).to.be.equal(
            instrumentInfo.body.limitTickPrecision
          );
          expect(get.body.leftSize).to.be.equal(1000);
          expect(get.body.status).to.be.equal('open');
          expect(get.body.side).to.be.equal('SHORT');
          expect(get.body.type).to.be.equal('LIMIT');
          expect(get.body.instrumentName).to.be.equal(market);
          expect(get.body.price).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.1)
          );
          expect(get.body.pricePrecision).to.be.equal(
            instrumentInfo.body.priceTickPrecision
          );

          const deletion = await cancelOrder({
            instrumentName: market,
            orderId
          });
          expect(deletion).to.have.status(200);
        });
        it('should post an order, delete it get it by ID ', async () => {
          const post = await createOrder({
            instrumentName: market,
            size: 1000,
            price: Math.round(priceInfo.body.currentPrice * 1.1),
            type: 'LIMIT',
            side: 'SHORT'
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('SHORT');
          expect(post.body.type).to.be.equal('LIMIT');
          expect(post.body.instrumentName).to.be.equal(market);
          expect(post.body.price).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.1)
          );
          const orderId = post.body.id;

          const deletion = await cancelOrder({
            instrumentName: market,
            orderId
          });
          expect(deletion).to.have.status(200);
          const get = await getOrderById({ instrumentName: market, orderId });
          expect(get).to.have.status(200);
          expect(get).to.have.property('body');
          expect(get.body.id).to.be.equal(orderId);
          expect(get.body.size).to.be.equal(1000);
          expect(get.body.sizePrecision).to.be.equal(
            instrumentInfo.body.limitTickPrecision
          );
          expect(get.body.leftSize).to.be.equal(1000);
          expect(get.body.status).to.be.equal('canceled');
          expect(get.body.side).to.be.equal('SHORT');
          expect(get.body.type).to.be.equal('LIMIT');
          expect(get.body.instrumentName).to.be.equal(market);
          expect(get.body.price).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.1)
          );
          expect(get.body.pricePrecision).to.be.equal(
            instrumentInfo.body.priceTickPrecision
          );
        });
        it('should fail to get an order that does not exists ', async () => {
          const get = await getOrderById({
            instrumentName: market,
            orderId: 0
          });
          expect(get).to.have.status(500);
          expect(get).to.have.property('body');
          expect(get.body).to.have.property('type');
          expect(get.body).to.have.property('message');
        });
        it('should fail to get an order sending empty params ', async () => {
          const get = await getOrderById({
            instrumentName: null,
            orderId: null
          });
          expect(get).to.have.status(500);
          expect(get).to.have.property('body');
          expect(get.body).to.have.property('type');
          expect(get.body).to.have.property('message');
        });
      });
      describe('/put', () => {
        it('should post an order and update all params', async () => {
          const post = await createOrder({
            instrumentName: market,
            size: 1000,
            price: Math.round(priceInfo.body.currentPrice * 1.1),
            type: 'LIMIT',
            side: 'SHORT'
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('SHORT');
          expect(post.body.type).to.be.equal('LIMIT');
          expect(post.body.instrumentName).to.be.equal(market);
          expect(post.body.price).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.1)
          );
          let orderId = post.body.id;
          const put = await updateOrder({
            instrumentName: market,
            orderId,
            size: 2000,
            price: Math.round(priceInfo.body.currentPrice * 1.1),
            type: 'LIMIT',
            side: 'SHORT'
          });
          expect(put).to.have.status(200);
          expect(put).to.have.property('body');
          expect(put.body.size).to.be.equal(2000);
          expect(put.body.side).to.be.equal('SHORT');
          expect(put.body.type).to.be.equal('LIMIT');
          expect(put.body.instrumentName).to.be.equal(market);
          expect(put.body.price).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.1)
          );
          orderId = put.body.id;
          const deletion = await cancelOrder({
            instrumentName: market,
            orderId
          });
          expect(deletion).to.have.status(200);
        });
        it('should fail to update an order with wrongs params', async () => {
          const post = await createOrder({
            instrumentName: market,
            size: 1000,
            price: Math.round(priceInfo.body.currentPrice * 1.1),
            type: 'LIMIT',
            side: 'SHORT'
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('SHORT');
          expect(post.body.type).to.be.equal('LIMIT');
          expect(post.body.instrumentName).to.be.equal(market);
          expect(post.body.price).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.1)
          );
          let orderId = post.body.id;
          const put = await updateOrder({
            instrumentName: 'AAA/AAA',
            orderId,
            size: 2000,
            price: Math.round(priceInfo.body.currentPrice * 1.1),
            type: 'LIMIT',
            side: 'SHORT'
          });
          expect(put).to.have.status(500);
          expect(put).to.have.property('body');
          expect(put.body).to.have.property('type');
          expect(put.body).to.have.property('message');
          const deletion = await cancelOrder({
            instrumentName: market,
            orderId
          });
          expect(deletion).to.have.status(200);
        });
      });
      describe('/get/all', () => {
        it(`should open an order get all orders and check if the last order is matches
        with the opened one `, async () => {
          const post = await createOrder({
            instrumentName: market,
            size: 1000,
            type: 'TAKE_PROFIT_MARKET',
            side: 'LONG',
            stopPrice: Math.round(priceInfo.body.currentPrice * 0.85)
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('LONG');
          expect(post.body.type).to.be.equal('TAKE_PROFIT_MARKET');
          expect(post.body.instrumentName).to.be.equal(market);

          expect(post.body.stopPrice).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 0.85)
          );
          const orderId = post.body.id;
          const allOrders = await getAllOrders({ instrumentName: market });
          const lastOrder = allOrders.body[allOrders.body.length - 1];
          expect(lastOrder.id).to.be.equal(orderId);
          expect(lastOrder.size).to.be.equal(1000);
          expect(lastOrder.sizePrecision).to.be.equal(
            instrumentInfo.body.limitTickPrecision
          );
          expect(lastOrder.leftSize).to.be.equal(1000);
          expect(lastOrder.status).to.be.equal('open');
          expect(lastOrder.side).to.be.equal('LONG');
          expect(lastOrder.type).to.be.equal('TAKE_PROFIT_MARKET');
          expect(lastOrder.instrumentName).to.be.equal(market);
          expect(lastOrder.stopPrice).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 0.85)
          );
          expect(lastOrder.pricePrecision).to.be.equal(
            instrumentInfo.body.priceTickPrecision
          );

          const deletion = await cancelOrder({
            instrumentName: market,
            orderId
          });
          expect(deletion).to.have.status(200);
        });
      });
      describe('/get/open', () => {
        it(`should open two orders, get all open orders and verify the two orders matches`, async () => {
          const post1 = await createOrder({
            instrumentName: market,
            size: 1000,
            type: 'TAKE_PROFIT_MARKET',
            side: 'LONG',
            stopPrice: Math.round(priceInfo.body.currentPrice * 0.85)
          });

          expect(post1).to.have.status(200);

          const post2 = await createOrder({
            instrumentName: market,
            size: 1000,
            price: Math.round(priceInfo.body.currentPrice * 1.1),
            type: 'LIMIT',
            side: 'SHORT'
          });

          expect(post2).to.have.status(200);

          const orderId1 = post1.body.id;
          const orderId2 = post2.body.id;

          const openOrders = await getOpenOrders({ instrumentName: market });
          expect(openOrders.body).to.have.lengthOf(2);
          const order1 = openOrders.body[0];
          expect(order1.id).to.be.equal(orderId1);
          expect(order1.size).to.be.equal(1000);
          expect(order1.sizePrecision).to.be.equal(
            instrumentInfo.body.limitTickPrecision
          );
          expect(order1.leftSize).to.be.equal(1000);
          expect(order1.status).to.be.equal('open');
          expect(order1.side).to.be.equal('LONG');
          expect(order1.type).to.be.equal('TAKE_PROFIT_MARKET');
          expect(order1.instrumentName).to.be.equal(market);
          expect(order1.stopPrice).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 0.85)
          );
          expect(order1.pricePrecision).to.be.equal(
            instrumentInfo.body.priceTickPrecision
          );
          const order2 = openOrders.body[1];
          expect(order2.id).to.be.equal(orderId2);
          expect(order2.size).to.be.equal(1000);
          expect(order2.sizePrecision).to.be.equal(
            instrumentInfo.body.limitTickPrecision
          );
          expect(order2.leftSize).to.be.equal(1000);
          expect(order2.status).to.be.equal('open');
          expect(order2.side).to.be.equal('SHORT');
          expect(order2.type).to.be.equal('LIMIT');
          expect(order2.instrumentName).to.be.equal(market);
          expect(order2.price).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.1)
          );
          expect(order2.pricePrecision).to.be.equal(
            instrumentInfo.body.priceTickPrecision
          );

          const deletion = await cancelAllOrders({
            instrumentName: market
          });
          expect(deletion).to.have.status(200);
        });
        it(`should get open orders with no orders open and return an empty array`, async () => {
          const openOrders = await getOpenOrders({ instrumentName: market });
          expect(openOrders).to.have.status(200);
          expect(openOrders.body).to.have.lengthOf(0);
        });
      });
    });
  });
});
