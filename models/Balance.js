const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const BalanceSchema = new Schema({
  _id: {
    type: String
  },
  username: {
    type: String,
  },
  balance: {
    type: Number,
  },
});
const Balance = mongoose.model('Balance', BalanceSchema);
module.exports = Balance;