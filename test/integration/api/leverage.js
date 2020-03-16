const chai = require('chai'),
  chaiHttp = require('chai-http');
const expect = chai.expect;
let server = require('../../../src/app');
let market = 'BTC/USDT';

chai.use(chaiHttp);

const setLeverage = ({ instrumentName, leverage }) =>
  chai
    .request(server)
    .post('/api/binance/leverage')
    .set('Accept', 'application/json')
    .set('accountId', 'test')
    .send({
      instrumentName,
      leverage
    });
const getLeverage = ({ instrumentName }) =>
  chai
    .request(server)
    .get('/api/binance/leverage')
    .set('Accept', 'application/json')
    .set('accountId', 'test')
    .query({
      instrumentName
    });

describe('api', () => {
  before(async () => {});

  describe('/binance', () => {
    describe('/leverage', () => {
      describe('/post', () => {
        it('should set a leverage of 25x', async () => {
          const post = await setLeverage({
            instrumentName: market,
            leverage: 25
          });
          console.log(post);
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.instrumentName).to.be.equal(market);
          expect(post.body.leverage).to.be.equal(25);
          expect(post.body.leveragePrecision).to.be.equal(1);
        });
        it('should fail to set a leverage of 1000x', async () => {
          const post = await setLeverage({
            instrumentName: market,
            leverage: 1000
          });
          expect(post).to.have.status(500);
          expect(post).to.have.property('body');
          expect(post.body).to.have.property('type');
          expect(post.body).to.have.property('message');
        });
      });
      describe.only('/get', () => {
        it('should set a leverage of 25x', async () => {
          const post = await setLeverage({
            instrumentName: market,
            leverage: 25
          });
          expect(post).to.have.status(200);
          expect(post).to.have.property('body');
          expect(post.body.instrumentName).to.be.equal(market);
          expect(post.body.leverage).to.be.equal(25);
          expect(post.body.leveragePrecision).to.be.equal(1);

          const get = await getLeverage({ instrumentName: market });
          expect(get).to.have.status(200);
          expect(get).to.have.property('body');
          expect(get.body.leverage).to.be.equal(25);
          expect(get.body.leveragePrecision).to.be.equal(1);
          expect(get.body.leverageIsolated).to.be.true;
        });
      });
    });
  });
});
