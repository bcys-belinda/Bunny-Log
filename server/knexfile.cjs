module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/bunnylog',
  migrations: {
    directory: './migrations',
    extension: 'cjs',
  },
};