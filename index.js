const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const {
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
  logError,
} = require('./middlewares/error.handler');
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});
 const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, './openApi/openapi.yml'));
//configuration cors

const whitelist = ['http://localhost:8080', 'https://myapp.co'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  },
};

const routerApi = require('./routes');

const app = express();

app.use(helmet());

app.use(morgan('tiny'));

app.use(express.json());
app.use(cors(options));
require('./utils/auth');

app.get('/', (req, res) => {
  res.send('New tasks');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//routerapis
routerApi(app);

app.use(logError);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('corriendo en el', port);
});
