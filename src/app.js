const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
var serverless = require('serverless-http');

const { router } = require('./api/');
const app = express();
const bodyParser = require('body-parser');
const {
  authenticateAndConnect,
  loadExchangeMarkets
} = require('./api/middleware/');
//comentar para serverless
// app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.use('/api', authenticateAndConnect, loadExchangeMarkets, router);

// Configura diretórios de logs
// if (!fs.existsSync("logs"))
// fs.mkdirSync("logs");

//comentar para serverless
// app.listen(app.get("port"), () => {
//   console.log("Node app is running on port", app.get("port"));
// });

module.exports = serverless(app);
