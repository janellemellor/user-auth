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

//used for signing up a user and logging in
//creates a token for a user and returns it
schema.methods.authToken = function() {
  const token = sign({ payload: this.toJSON() }, process.env.APP_SECRET);
  return token;
};

//add user login authorization
schema.statics.authorize = async function({ username, password }) {
  //check if a user with the username already exists. If it doesn't exist, throw an error
  const user = await this.findOne({ username });
  if(!user) {
    const error = new Error('Invalid username or password');
    error.status = 403;
    throw error;
  }
  //check if the user with the username has a matching password. If not, throw an error
  const matchingPasswords = await compare(password, user.passwordHash);
  if(!matchingPasswords) {
    const error = new Error('Invalid username or password');
    error.status = 403;
    throw error;
  }
  //if the user matches a username and a password, return the user
  return user;
  //otherwise throw an error
};


module.exports = mongoose.model('User', schema);
