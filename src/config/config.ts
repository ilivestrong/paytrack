const DBConfig = () => ({
  dbconfig: {
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});

const QueueConfig = () => ({
  queueconfig: {
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    jobBatchSize: process.env.JOB_BATCH_SIZE || 10,
  },
});

export { DBConfig, QueueConfig };
