/* eslint new-cap: [2, {"capIsNewExceptions": ["Router"]}] */
import { Router } from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import { localAuth } from '../../strategies';
import {
  getAccessToken,
  getRefreshToken,
  validateRefreshToken,
  registerUser,
} from './middleware';

const router = Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(passport.initialize());

router.post('/login',
  localAuth,
  getAccessToken,
  getRefreshToken,
  (req, res) => res.json(req.token)
);

router.post('/token',
  validateRefreshToken,
  getAccessToken,
  (req, res) => {
    res.status(201).json({
      token: req.token,
    });
  });

router.post('/register',
  registerUser
);

export default router;
