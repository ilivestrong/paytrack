export default () => ({
  dbconfig: {
    host: process.env.DBHOST || 'localhost',
    port: process.env.DBPORT || 5432,
    database: process.env.DATABASE || 'paytrack',
    username: process.env.username || 'postgres',
    password: process.env.password || 'postgres'
  },
});
