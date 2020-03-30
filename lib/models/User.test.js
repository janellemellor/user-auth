require('dotenv').config();

const User = require('./User');

describe('User model', () => {
  it('hashes a password', () => {
    const user = new User({
      username: 'fox',
      password: 'ilovecookies'
    });
    expect(user.passwordHash).toEqual(expect.any(String));
    expect(user.toJSON().password).toBeUndefined();
  });

  it('creates a jwt', () => {
    const user = new User({
      username: 'fox',
      password: 'ilovecookies'
    });
    const token = user.authToken();
    expect(token).toBeTruthy();
  });
    
});
