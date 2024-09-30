const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  date: {
    day: { type: Number, required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true }
  },
  time: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true },
  collegeId: { type: String, required: true },
  category: { type: String, required: true },
  maxRegistrations: { type: Number, required: true },
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RegisteredUser' }],
  organizer: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  registrationDeadline: { type: Date, required: true },
  feedback: [{
    user: String,
    comment: String
  }]
});

module.exports = mongoose.model('Event', eventSchema);
