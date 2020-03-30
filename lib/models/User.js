const mongoose = require('mongoose');
const { hashSync, compare } = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');

const schema = new mongoose.Schema({
  username: {
    type: String, 
    required: true
  }, 
  passwordHash: {
    type: String, 
    required: true    
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
    }
  }
});

//use a virtual to ensure that a plain text password never gets saved to the database
schema.virtual('password').set(function(password) {
  //hash the password using bcrypt
  const hash = hashSync(password, Number(process.env.SALT_ROUNDS) || 14);
  //set passwordHash to the hashed password
  this.passwordHash = hash;
});

module.exports = mongoose.model('User', schema);
