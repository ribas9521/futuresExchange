const chai = require('chai'),
  chaiHttp = require('chai-http');
const expect = chai.expect;
let server = require('../../../src/app');

chai.use(chaiHttp);

function getInstrumentPriceInfo({ instrumentName }) {
  return chai
    .request(server)
    .get('/api/binance/instrument/price')
    .set('exchangeName', 'binance')
    .set('accountId', 'test')
    .query({ instrumentName });
}
describe('api', () => {
  let priceInfo;
  before(() => {
    getInstrumentPriceInfo({
      instrumentName: 'BTC/USDT'
    })
      .then(resp => {
        console.log(resp);
        priceInfo = resp;
      })
      .catch(e => {
        console.log('############3');
        console.log(e);
      })
      .end(resp => {
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@');
      });
  });

  describe('/binance', () => {
    describe('/order', () => {
      it('should post a limit short order and cancel it', async () => {
        console.log(priceInfo.body.currentPrice);
        const post = await chai
          .request(server)
          .post('/api/binance/order')
          .set('Accept', 'application/json')
          .set('exchangeName', 'binance')
          .set('accountId', 'test')
          .send({
            instrumentName: 'btc/usdt',
            customId: 'ordertestId',
            size: 1000,
            side: 'SHORT',
            type: 'LIMIT',
            price: priceInfo.body.currentPrice
          });
        expect(post).to.have.status(200);
        expect(post).to.have.property('body');
        expect(post.body.customId).to.be.equal('ordertestId');
        expect(post.body.size).to.be.equal(1000);
        expect(post.body.side).to.be.equal('SHORT');
        expect(post.body.type).to.be.equal('LIMIT');
        expect(post.body.price).to.be.equal(1000000);
        const orderId = post.body.id;
        const deletion = await chai
          .request(server)
          .delete('/api/binance/order')
          .set('Accept', 'application/json')
          .set('exchangeName', 'binance')
          .set('accountId', 'test')
          .query({ instrumentName: 'btc/usdt', orderId });
        expect(deletion).to.have.status(200);
      });
    });
  });
});
