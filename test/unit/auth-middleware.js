
import { describe, it } from 'mocha';
import { assert } from 'chai';
import jwt from 'jsonwebtoken';
import { getAccessToken } from '../../lib/auth/middleware';

const id = 9999;

describe('token', () => {
  it('should generate access token with encoded id', (done) => {
    const req = { user: { id } };
    const res = {};
    getAccessToken(req, res, () => null);
    const dtoken = jwt.decode(req.token.accessToken, 'secret');
    assert.isOk(req.token.accessToken);
    assert.equal(dtoken.id, id);
    done();
  });

// convert other tests from tape to mocha
// test('should error when generating access token with id missing to encode', (t) => {
//   const req = {};
//   const res = {};
//   generateAccessToken({ secret: 'secret' })(req, res, err => {
//     t.ok(err);
//     t.equal(err.message, 'User identity not set, cannot create jwt');
//     t.end();
//   });
// });
//
// test('should find user based on refresh token and update request with user', (t) => {
//   const req = {};
//   const db = {
//     findUserOfToken(token, cb) {
//       cb(null, { id });
//       t.ok(req.user);
//       t.equal(req.user.id, id);
//       t.end();
//     },
//   };
//   validateRefreshToken(db)(req, {}, () => {});
// });
//
// test('should error when generating access token with id missing to encode', (t) => {
//   const req = {};
//   const res = {};
//   const db = {
//     findUserOfToken(token, cb) {
//       cb(null, null);
//     },
//   };
//   validateRefreshToken(db)(req, res, err => {
//     t.ok(err);
//     t.equal(err.message, 'Refresh token invalid');
//     t.end();
//   });
// });
