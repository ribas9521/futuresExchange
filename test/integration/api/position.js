const chai = require('chai'),
  chaiHttp = require('chai-http');
const expect = chai.expect;
let server = require('../../../src/app');
let market = 'BTC/USDT';

chai.use(chaiHttp);

const getPosition = ({ instrumentName }) =>
  chai
    .request(server)
    .get('/api/binance/position')
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
    describe('/position', () => {
      describe('/get', () => {
        it(`should open a position, check if the balance used 
        matches with leverage and current price, than close the position`, async () => {
          const post = await createOrder({
            instrumentName: market,
            size: 1000,
            type: 'MARKET',
            side: 'LONG'
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.size).to.be.equal(1000);
          expect(post.body.side).to.be.equal('LONG');
          expect(post.body.type).to.be.equal('MARKET');
          expect(post.body.instrumentName).to.be.equal(market);

          const get = await getPosition({ instrumentName: market });
          expect(get).to.have.status(200);
          expect(get).to.have.property('body');
          expect(get.body.balanceUsed).to.be.closeTo(
            priceInfo.body.currentPrice / get.body.leverage,
            100
          );

          const cancel = await createOrder({
            instrumentName: market,
            size: 1000,
            type: 'MARKET',
            side: 'SHORT'
          });
          expect(cancel).to.have.status(200);
        });
      });
    });
  });
});
