const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  filename: String,
  contentType: String,
  image: Buffer
});
const ImageModel = mongoose.model('Image', imageSchema);

module.exports = ImageModel;
