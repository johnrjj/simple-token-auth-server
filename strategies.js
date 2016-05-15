import LocalStrategy from 'passport-local';
import passport from 'passport';
import { getUserFromCredentials } from './lib/db/user-repository';

const localStrategyNoSession = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await getUserFromCredentials(username, password);
    return done(null, user);
  } catch (err) {
    if (err.code === 404 || err.message === 'Incorrect password') {
      return done(null, false);
    }
    return done(err);
  }
});

passport.use('local', localStrategyNoSession);
const localAuth = passport.authenticate('local', { session: false, scope: [] });

export {
  localAuth,
};
