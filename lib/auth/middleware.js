/*  eslint no-param-reassign: 0 */
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../../config';
import { getUserFromRefreshToken, register, saveRefreshToken } from '../db/user-repository';

const defaultTokenTime = 1800;

// authorizes, decrypts, and assigns jwt params to req.user
const authUserFromAccessToken = expressJwt({
  secret: config.secret,
});

const getRefreshToken = async (req, res, next) => {
  if (req.body.persist) {
    const refreshToken = `${req.user.id}.${crypto.randomBytes(40).toString('hex')}`;
    const x = await saveRefreshToken(req.user.id, refreshToken);
    req.token.refreshToken = refreshToken;
  }
  return next();
};

const getAccessToken = (req, res, next) => {
  if (!req.user && !req.user.id) {
    next(new Error('User not set, cannot create jwt, please login again'));
  } else {
    req.token = req.token || {};
    req.token.accessToken = jwt.sign(
      { id: req.user.id, username: req.user.username },
      config.secret,
      { expiresIn: config.tokenTime || defaultTokenTime });
    next();
  }
};

const validateRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  console.log(req.body);
  try {
    const user = await getUserFromRefreshToken(refreshToken);
    if (!user) {
      next(new Error('loaded a blank user?? would this ever happen?'));
    }
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};

const registerUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await register({ username, password });
    res.status(201).json({
      username: user.username,
      registered: true,
    });
  } catch (err) {
    res.status(201).json({
      error: 'Could not create username',
    });
  }
};

export {
  getAccessToken,
  getRefreshToken,
  authUserFromAccessToken,
  validateRefreshToken,
  registerUser,
};
