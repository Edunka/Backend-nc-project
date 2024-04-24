const { Pool } = require('pg');
const ENV = process.env.production || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}
const config = {};
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}
if (ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}
module.exports = new Pool(config);
