const config = {
  secret: 'SECRET',
  tokenTime: 1800,
  port: process.env.PORT || 8080,
  env: process.env.NODE_ENV || 'dev',
  mongodb: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/local',
    collection: process.env.MONGO_LINKS_COLLECTION || 'users',
  },
};

export default config;
