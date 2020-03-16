const chai = require('chai'),
  chaiHttp = require('chai-http');
const expect = chai.expect;
let server = require('../../../src/app');
let market = 'BTC/USDT';

chai.use(chaiHttp);

const getBalance = () =>
  chai
    .request(server)
    .get('/api/binance/account/balance')
    .set('Accept', 'application/json')
    .set('accountId', 'test');

describe('api', () => {
  before(async () => {});

  describe('/binance', () => {
    describe('/account', () => {
      describe('/get/balance', () => {
        it('should get the users balance', async () => {
          const get = await getBalance();
          expect(get).to.have.status(200);
          expect(get).to.have.property('body');
          expect(get.body).to.have.property('total');
          expect(get.body.total).to.be.a('number');
          expect(get.body.total % 1).to.equal(0);
          expect(get.body.available).to.be.a('number');
          expect(get.body.available % 1).to.equal(0);
          expect(get.body.used).to.be.a('number');
          expect(get.body.used % 1).to.equal(0);
          expect(get.body.precision).to.be.a('number');
          expect(get.body.precision % 1).to.equal(0);
        });
      });
    });
  });
});
