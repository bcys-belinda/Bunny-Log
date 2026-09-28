const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/bunnylog',
  migrations: {
    directory: './migrations',
    extension: 'cjs',
  },
};