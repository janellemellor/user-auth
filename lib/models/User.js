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
});

module.exports = mongoose.model('User', schema);
