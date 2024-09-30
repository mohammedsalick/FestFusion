import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTag, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState(null);
  const [remainingRegistrations, setRemainingRegistrations] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEvent();
  }, [id, location.pathname]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(response.data);
      setRemainingRegistrations(response.data.maxRegistrations - response.data.registeredUsers.length);
    } catch (err) {
      setError('Failed to fetch event details. Please try again later.');
    }
  };

  useEffect(() => {
    if (event && userName) {
      setIsRegistered(event.registeredUsers.some(user => user.name === userName));
    }
  }, [event, userName]);

  const handleRegister = async () => {
    if (userName && email && phone && event) {
      if (!isRegistered && remainingRegistrations > 0) {
        try {
          const response = await axios.post(`http://localhost:5000/api/events/${id}/register`, { 
            name: userName, 
            email, 
            phone 
          });
          
          if (response.data.success) {
            setEvent(response.data.event);
            setIsRegistered(true);
            setRemainingRegistrations(prev => prev - 1);
            toast.success(`You've successfully registered for ${event.heading}!`);
          } else {
            toast.error(response.data.message || 'Failed to register. Please try again.');
          }
        } catch (err) {
          console.error('Registration error:', err);
          toast.error(err.response?.data?.message || 'Failed to register. Please try again.');
        }
      } else if (remainingRegistrations <= 0) {
        toast.error("Sorry, this event is fully booked.");
      } else {
        toast.info("You're already registered for this event.");
      }
    } else {
      toast.error('Please fill in all fields to register.');
    }
  };

  const handleFeedback = () => {
    navigate(`/events/${id}/feedback`);
  };

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  if (!event) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen pb-24">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {event.heading}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mb-12">
            {event.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src={event.img} alt={event.heading} className="rounded-lg shadow-2xl w-full h-auto" />
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-lg shadow-xl">
              <p className="text-2xl font-bold text-blue-600">{event.registeredUsers.length} Attendees</p>
              <p className="text-gray-600">{remainingRegistrations} spots left!</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-4">
              <p className="flex items-center text-xl text-gray-600 mb-2">
                <FaCalendarAlt className="mr-2" />
                {event.date.day} {event.date.month} {event.date.year}
              </p>
              <p className="flex items-center text-xl text-gray-600 mb-2">
                <FaClock className="mr-2" />
                {event.time}
              </p>
              <p className="flex items-center text-xl text-gray-600 mb-2">
                <FaMapMarkerAlt className="mr-2" />
                {event.location}
              </p>
              <p className="flex items-center text-lg text-purple-600 mb-2">
                <FaTag className="mr-2" />
                Category: {event.category}
              </p>
              <p className="flex items-center text-lg text-blue-600 mb-2">
                <FaUser className="mr-2" />
                Organizer: {event.organizer}
              </p>
              <p className="flex items-center text-lg text-gray-600 mb-2">
                <FaEnvelope className="mr-2" />
                Contact: {event.contactEmail}
              </p>
              <p className="flex items-center text-lg text-gray-600 mb-4">
                <FaPhone className="mr-2" />
                Phone: {event.contactPhone}
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-full shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-full shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full border border-gray-300 rounded-full shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRegister}
                disabled={remainingRegistrations <= 0 || isRegistered}
                className={`w-full sm:w-1/2 py-3 px-4 rounded-full text-white font-bold text-lg transition duration-300 ${
                  isRegistered ? 'bg-green-500 hover:bg-green-600' : 
                  remainingRegistrations <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isRegistered ? 'Already Registered' : 
                 remainingRegistrations <= 0 ? 'Event Full' : 'Register for Event'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFeedback}
                className="w-full sm:w-1/2 py-3 px-4 rounded-full text-white font-bold text-lg bg-purple-600 hover:bg-purple-700 transition duration-300"
              >
                Provide Feedback
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-lg shadow-xl p-6 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-blue-600">Event Feedback</h2>
          {event.feedback && event.feedback.length > 0 ? (
            <div className="space-y-4">
              {event.feedback.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-100 rounded-lg p-4"
                >
                  <p className="font-semibold text-blue-600">{item.user}</p>
                  <p className="text-gray-700 mt-2">{item.comment}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No feedback yet. Be the first to provide feedback!</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Link
            to="/events"
            className="inline-block bg-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg hover:bg-purple-700 transition duration-300"
          >
            Explore More Events
          </Link>
        </motion.div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default EventDetails;