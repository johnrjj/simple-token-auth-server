import express from 'express';
import logger from 'morgan';
import passport from 'passport';
import helmet from 'helmet';
import auth from './lib/auth/routes';
import api from './lib/api/routes';

const app = express();

app.set('trust proxy', true);
app.use('/', express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(helmet());
app.use(passport.initialize());

app.get('/healthcheck', (req, res) => {
  res.sendStatus(200);
});

app.use('/auth', auth);
app.use('/api/v1', api);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      message: error.message,
      error,
    });
  });
}

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
    error: {},
  });
  return null;
});

export default app;
