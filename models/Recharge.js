const mongoose = require('mongoose');

const rechargeSchema = new mongoose.Schema({
  selectedSim: String,
  phoneNumber: String,
  amount: Number,
});

const Recharge = mongoose.model('Recharge', rechargeSchema);
module.exports = Recharge;
