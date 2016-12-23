/* eslint new-cap: [2, {"capIsNewExceptions": ["Router"]}] */
import { Router } from 'express';
import bodyParser from 'body-parser';
import { authUserFromAccessToken } from '../auth/middleware';

const router = Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/me', authUserFromAccessToken, (req, res) => {
  res.status(200).json(Object.assign({}, req.user, req.token));
});

router.get('/protected', authUserFromAccessToken, (req, res) => {
  res.status(200).send('authed');
});

router.get('/public', (req, res) => {
  res.status(200).send('hello there, world');
});

export default router;
