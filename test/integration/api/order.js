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

const getAllInstruments = async () =>
  chai
    .request(server)
    .get('/api/binance/instrument/all')
    .set('Accept', 'application/json')
    .set('accountId', 'test');

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
      type,
      price
    });

describe('api', () => {
  let priceInfo;
  let marketInfo;
  before(async () => {
    priceInfo = await getInstrumentPriceInfo({ instrumentName: market });
    expect(priceInfo).to.have.status(200);
    // marketInfo = await getAllInstruments();
    // expect(marketInfo).to.have.status(200);
  });

  describe('/binance', () => {
    describe('/order', () => {
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
    });
  });
});
