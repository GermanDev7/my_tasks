const express = require('express');
const cors = require('cors');
const {
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
  logError,
} = require('./middlewares/error.handler');
require('dotenv').config();

const routerApi = require('./routes');

const app = express();

app.use(express.json());
//falta cors
require('./utils/auth');

app.get('/', (req, res) => {
  res.send('New tasks');
});
//routerapis
routerApi(app);

app.use(logError);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('escuchando en el puerto', port);
});
