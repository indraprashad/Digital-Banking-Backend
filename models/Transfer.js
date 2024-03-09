const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TransferSchema = new Schema({
  sender: {
    type: String
  },
  recipient: {
    type: String,
  },
  amount: {
    type: Number,
  },
  remarks:{
    type: String,
  },
});
const Transfer = mongoose.model('Transfer', TransferSchema);
module.exports = Transfer;