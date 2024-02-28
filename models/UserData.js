const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Name: String,
  Account: Number,
  Balance: Number,
  Transfer: Number,
  Received: Number,
  Recharge: Number,

});

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = UserData;
