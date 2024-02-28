const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
  _id: { type: String, required: true },
  username: {
    type: String,
    unique: false,
    required: true,
  },
  balance: {
    type: String,
    unique: false,
    required: true,
  },
  remarks: {
    type: String,
    required: true,
  },
});
const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;