require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'develompent',
  por: process.env.PORT || 3000,
  dbUrl: process.env.DB_URL,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  apikey:process.env.API_KEY,
  jwtSecret:process.env.JWT_SECRET,
  dialect:process.env.DIALECT
};

module.exports = { config };
