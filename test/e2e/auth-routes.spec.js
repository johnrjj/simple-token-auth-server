import { describe, it } from 'mocha';
import { assert } from 'chai';
import request from 'supertest';
import app from '../../server.js';

describe('registration', () => {
  it('user can register', (done) => {
    request(app)
      .post('/auth/register')
      .send({ username: 'blah', password: 'blahhh' })
      .expect(201)
      .expect('Content-type', /json/)
      .end((err, res) => {
        assert.equal(true, res.body.registered);
        assert.equal('blah', res.body.username);
        done();
      });
  });
});
