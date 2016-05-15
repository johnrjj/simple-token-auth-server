import app from './server';
import config from './config';

const start = () =>
  app.listen(config.port, () => {
    console.log(`Running on port ${config.port}`);
  });

start();
