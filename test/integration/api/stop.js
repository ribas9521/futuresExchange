const chai = require('chai'),
  chaiHttp = require('chai-http');
const expect = chai.expect;
let server = require('../../../src/app');
let market = 'BTC/USDT';
chai.use(chaiHttp);

const cancelAllOrders = ({ instrumentName }) =>
  chai
    .request(server)
    .post('/api/binance/order/cancel/all')
    .set('Accept', 'application/json')
    .set('accountId', 'test')
    .query({ instrumentName });
const getStops = ({ instrumentName }) =>
  chai
    .request(server)
    .get('/api/binance/stop')
    .set('Accept', 'application/json')
    .set('accountId', 'test')
    .query({
      instrumentName
    });
const getOpenStops = ({ instrumentName }) =>
  chai
    .request(server)
    .get('/api/binance/stop/open')
    .set('Accept', 'application/json')
    .set('accountId', 'test')
    .query({
      instrumentName
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

const getInstrumentPriceInfo = ({ instrumentName }) =>
  chai
    .request(server)
    .get('/api/binance/instrument/price')
    .set('accountId', 'test')
    .query({ instrumentName });

describe('api', () => {
  let priceInfo;
  before(async () => {
    priceInfo = await getInstrumentPriceInfo({ instrumentName: market });
    expect(priceInfo).to.have.status(200);
  });

  describe('/binance', () => {
    describe('/stop', () => {
      describe('/get', () => {
        it(`should open two orders and check if the stops are concise then cancel both`, async () => {
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
            stopPrice: Math.round(priceInfo.body.currentPrice * 1.1),
            type: 'TAKE_PROFIT_MARKET',
            side: 'SHORT'
          });

          expect(post2).to.have.status(200);

          const stops = await getStops({ instrumentName: market });
          expect(stops).to.have.status(200);
          expect(stops).to.have.property('body');
          expect(stops.body).to.have.length.greaterThan(0);
          expect(stops.body[stops.body.length - 1].stopPrice).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.1)
          );
          expect(stops.body[stops.body.length - 2].stopPrice).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 0.85)
          );
          const cancel = await cancelAllOrders({ instrumentName: market });
          expect(cancel).to.have.status(200);
        });
        it(`should open two orders and check if the OPEN stops are concise then cancel both`, async () => {
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
            stopPrice: Math.round(priceInfo.body.currentPrice * 1.1),
            type: 'TAKE_PROFIT_MARKET',
            side: 'SHORT'
          });

          expect(post2).to.have.status(200);

          const stops = await getOpenStops({ instrumentName: market });
          expect(stops).to.have.status(200);
          expect(stops).to.have.property('body');
          expect(stops.body).to.have.lengthOf(2);
          expect(stops.body[stops.body.length - 1].stopPrice).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 1.1)
          );
          expect(stops.body[stops.body.length - 2].stopPrice).to.be.equal(
            Math.round(priceInfo.body.currentPrice * 0.85)
          );
          const cancel = await cancelAllOrders({ instrumentName: market });
          expect(cancel).to.have.status(200);
        });
      });
    });
  });
});
