const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  botanicalName: { type: String, default: "Species unclassified" },
  waterStatus: { type: String, required: true },
  image: { type: String, required: true } // Base64 string image
});

module.exports = mongoose.model('Plant', plantSchema);