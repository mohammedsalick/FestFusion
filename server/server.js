require('dotenv').config(); // Add this line at the top

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const eventRoutes = require('./routes/events'); // Adjust the path as needed
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); // Add this line


dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Add this line


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));