const chai = require('chai'),
  chaiHttp = require('chai-http');
const expect = chai.expect;
let server = require('../../../src/app');
let market = 'BTC/USDT';

chai.use(chaiHttp);

const getOrderBook = ({ instrumentName }) =>
  chai
    .request(server)
    .get('/api/binance/orderbook')
    .set('Accept', 'application/json')
    .set('accountId', 'test')
    .query({
      instrumentName
    });

describe('api', () => {
  before(async () => {});

  describe('/binance', () => {
    describe('/orderbook', () => {
      describe.only('/get', () => {
        it('should get the orderbook', async () => {
          const get = await getOrderBook({ instrumentName: market });
          expect(get).to.have.status(200);
          expect(get).to.have.property('body');
          expect(get.body).to.have.property('long');
          expect(get.body.long).to.have.length.greaterThan(0);
          expect(get.body.long[0]).to.have.property('price');
          expect(get.body.long[0]).to.have.property('size');
          expect(get.body.long[0]).to.have.property('pricePrecision');
          expect(get.body.long[0]).to.have.property('sizePrecision');
          expect(get.body).to.have.property('short');
          expect(get.body.short).to.have.length.greaterThan(0);
          expect(get.body.short[0]).to.have.property('price');
          expect(get.body.short[0]).to.have.property('size');
          expect(get.body.short[0]).to.have.property('pricePrecision');
          expect(get.body.short[0]).to.have.property('sizePrecision');
        });
      });
    });
  });
});
