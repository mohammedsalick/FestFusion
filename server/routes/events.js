const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const RegisteredUser = require('../models/RegisteredUser');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  const eventData = {
    ...req.body,
    registeredUsers: [],
    date: {
      day: req.body.date.day,
      month: req.body.date.month,
      year: req.body.date.year
    },
    registrationDeadline: new Date(req.body.registrationDeadline)
  };

  const event = new Event(eventData);

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register for an event
router.post('/:id/register', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const { name, email, phone } = req.body;

    if (event.registeredUsers.length >= event.maxRegistrations) {
      return res.status(400).json({ success: false, message: 'Event is fully booked' });
    }

    let user = await RegisteredUser.findOne({ email });

    if (!user) {
      user = new RegisteredUser({
        name,
        email,
        phone,
        registeredEvents: [event._id]
      });
    } else {
      if (user.registeredEvents.includes(event._id)) {
        return res.status(400).json({ success: false, message: 'You are already registered for this event' });
      }
      user.registeredEvents.push(event._id);
    }

    await user.save();

    event.registeredUsers.push(user._id);
    await event.save();

    // Fetch the updated event with populated registeredUsers
    const updatedEvent = await Event.findById(req.params.id).populate('registeredUsers', 'name email');

    res.json({ 
      success: true, 
      message: 'Successfully registered for the event', 
      event: updatedEvent
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
});

// Add feedback to an event
router.post('/:id/feedback', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const { user, comment } = req.body;
    event.feedback.push({ user, comment });
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get events for a specific user
router.get('/user/events', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find the user
    const user = await RegisteredUser.findOne({ email });
    
    if (!user) {
      return res.json([]);
    }

    console.log('User found:', user);
    console.log('Registered Events IDs:', user.registeredEvents);

    // Fetch the events using the IDs in registeredEvents
    const events = await Event.find({ _id: { $in: user.registeredEvents } });

    console.log('Fetched Events:', events);

    res.json(events);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Get events for a specific user by ID
router.get('/user/:userId/registered', async (req, res) => {
  try {
    const userId = req.params.userId;
    const events = await Event.find({ 'registeredUsers.userId': userId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registered events', error: error.message });
  }
});

module.exports = router;
