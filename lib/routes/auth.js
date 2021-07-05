const { Router } = require('express');
const User = require('../models/User');
const ensureAuth = require('../middleware/ensure-auth');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => {
        const token = user.authToken();
        res.cookie('session', token, {
          maxAge: ONE_DAY_IN_MS,
          httpOnly: true
        });
        res.send(user);
      })
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    //check if a users username and password are authorized
    User
      .authorize(req.body)
      .then(user => {
        //create a jwt
        const token = user.authToken();
        //send the user and jwt

        res.cookie('session', token, {
          maxAge: ONE_DAY_IN_MS,
          httpOnly: true
        });
        res.send(user);
      })
      .catch(next);
  })

  .get('/verify', ensureAuth, (req, res) => {
    //send an error is the user is not logged in
    
    //send the user if the person is logged in
    res.send(req.user);
  });
