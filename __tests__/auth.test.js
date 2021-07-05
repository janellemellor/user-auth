require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('signs up a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'fox', password: 'ilovecookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'fox',
          __v: 0
        });
      });
  });

  it('logs a user in', async() => {
    await User.create({ username: 'fox', password: 'ilovecookies' });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'fox', password: 'ilovecookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'fox',
          __v: 0
        });
      });
  });

  it('throws an error for an unathorized user', async() => {
    await User.create({ username: 'fox', password: 'ilovecookies' });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'fox', password: 'cookiesaregross' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid username or password', 
          status: 403
        });
      });
  });

});
