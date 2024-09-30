import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaClock, FaUser } from 'react-icons/fa';

const MyEvents = () => {
  const [email, setEmail] = useState('');
  const [userEvents, setUserEvents] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (email) {
      fetchUserEvents();
    } else {
      setUserEvents([]);
      setError(null);
    }
  }, [email]);

  const fetchUserEvents = async () => {
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/events/user/events`, {
        params: { email }
      });
      console.log('Fetched events:', response.data);
      setUserEvents(response.data);
      if (response.data.length === 0) {
        setError('No registered events found for this email');
      }
    } catch (err) {
      console.error('Error fetching user events:', err);
      setError(`Failed to fetch your events: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 pb-24">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Your Epic<br />Adventures
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Discover the events you're part of and relive the excitement. Enter your email to see your registered events.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-6">
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Your Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-full shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
            {error && <p className="text-xl text-red-600 mb-6">{error}</p>}
            {userEvents.length > 0 && (
              <div className="space-y-4">
                {userEvents.map((event) => (
                  <motion.div
                    key={event._id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg p-6 shadow-lg"
                  >
                    <h3 className="text-2xl font-bold mb-2">{event.heading}</h3>
                    <div className="flex items-center mb-2 text-gray-600">
                      <FaCalendarAlt className="mr-2" />
                      <p>{event.date.day} {event.date.month} {event.date.year}</p>
                    </div>
                    <div className="flex items-center mb-2 text-gray-600">
                      <FaClock className="mr-2" />
                      <p>{event.time}</p>
                    </div>
                    <div className="flex items-center mb-2 text-gray-600">
                      <FaMapMarkerAlt className="mr-2" />
                      <p>{event.location}</p>
                    </div>
                    <div className="flex items-center mb-2 text-purple-600">
                      <FaTag className="mr-2" />
                      <p>Category: {event.category}</p>
                    </div>
                    <div className="flex items-center mb-4 text-blue-600">
                      <FaUser className="mr-2" />
                      <p>Organizer: {event.organizer}</p>
                    </div>
                    <Link 
                      to={`/events/${event._id}`} 
                      className="inline-block bg-blue-600 text-white py-2 px-6 rounded-full font-bold hover:bg-blue-700 transition duration-300"
                    >
                      View Details
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-lg shadow-xl">
              <p className="text-2xl font-bold text-blue-600">{userEvents.length} Events</p>
              <p className="text-gray-600">You're part of</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MyEvents;