const mongoose = require('mongoose');

const registeredUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

module.exports = mongoose.model('RegisteredUser', registeredUserSchema);
