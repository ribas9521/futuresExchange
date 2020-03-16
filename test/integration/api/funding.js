const chai = require('chai'),
  chaiHttp = require('chai-http');
const expect = chai.expect;
let server = require('../../../src/app');
let market = 'BTC/USDT';

chai.use(chaiHttp);

const getFunding = ({ instrumentName }) =>
  chai
    .request(server)
    .get('/api/binance/funding')
    .set('Accept', 'application/json')
    .set('accountId', 'test')
    .query({
      instrumentName
    });

describe('api', () => {
  before(async () => {});

  describe('/binance', () => {
    describe('/funding', () => {
      describe('/get/funding', () => {
        it('should the instrument funding', async () => {
          const get = await getFunding({ instrumentName: market });
          expect(get).to.have.status(200);
          expect(get).to.have.property('body');
          expect(get.body).to.have.property('nextFunding');
          expect(get.body.nextFunding).to.be.a('number');
          expect(get.body.nextFunding % 1).to.equal(0);
          expect(get.body.fundingRate).to.be.a('number');
          expect(get.body.fundingRate % 1).to.equal(0);
          expect(get.body.fundingRatePrecision).to.be.a('number');
          expect(get.body.fundingRatePrecision % 1).to.equal(0);
        });
      });
    });
  });
});
