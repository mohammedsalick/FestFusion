import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaClock, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa'; // Import icons
import { useAuth } from '../AuthContext';

const Home = () => {
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(null);
  const [totalEvents, setTotalEvents] = useState(0);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      const events = response.data;
      setTotalEvents(events.length);

      // Sort events by date, newest first
      const sortedEvents = events.sort((a, b) => {
        const dateA = new Date(a.date.year, getMonthNumber(a.date.month), a.date.day);
        const dateB = new Date(b.date.year, getMonthNumber(b.date.month), b.date.day);
        return dateB - dateA;
      });

      // Set the newest event as the featured event
      setFeaturedEvent(sortedEvents[0]);

      // Set all events as upcoming events
      setUpcomingEvents(sortedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events. Please try again later.');
    }
  };

  // Helper function to convert month name to number
  const getMonthNumber = (monthName) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(monthName) + 1; // Add 1 to make it 1-indexed
  };

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
      {/* Hero Section with Asymmetrical Layout */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Discover<br />Extraordinary<br />Events
            </h1>
            <p className="text-xl mb-8 text-gray-700">
              Immerse yourself in a world of unforgettable experiences.
            </p>
            <Link to="/events" className="bg-blue-600 text-white py-3 px-8 rounded-full font-bold hover:bg-blue-700 transition duration-300 inline-block">
              Explore Events
            </Link>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src="/path-to-hero-image.jpg" alt="Event collage" className="rounded-lg shadow-2xl" />
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-lg shadow-xl">
              <p className="text-2xl font-bold text-blue-600">{totalEvents}+ Events</p>
              <p className="text-gray-600">Waiting to be discovered</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Event Section */}
      {featuredEvent && (
        <section className="py-16 bg-white skew-y-3">
          <div className="container mx-auto px-4 -skew-y-3">
            <h2 className="text-4xl font-bold mb-12 text-center">Featured Event</h2>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-1">
              <div className="bg-white rounded-lg overflow-hidden flex flex-col md:flex-row">
                <img src={featuredEvent.img} alt={featuredEvent.heading} className="w-full md:w-1/2 object-cover" />
                <div className="p-8 md:w-1/2">
                  <h3 className="text-3xl font-bold mb-4">{featuredEvent.heading}</h3>
                  <div className="flex items-center mb-2 text-gray-600">
                    <FaCalendarAlt className="mr-2" />
                    <p>{featuredEvent.date.day} {featuredEvent.date.month} {featuredEvent.date.year}</p>
                  </div>
                  <div className="flex items-center mb-2 text-gray-600">
                    <FaClock className="mr-2" />
                    <p>{featuredEvent.time}</p>
                  </div>
                  <div className="flex items-center mb-2 text-gray-600">
                    <FaMapMarkerAlt className="mr-2" />
                    <p>{featuredEvent.location}</p>
                  </div>
                  <div className="flex items-center mb-2 text-purple-600">
                    <FaTag className="mr-2" />
                    <p>Category: {featuredEvent.category}</p>
                  </div>
                  <div className="flex items-center mb-2 text-blue-600">
                    <FaUser className="mr-2" />
                    <p>Organizer: {featuredEvent.organizer}</p>
                  </div>
                  <p className="text-gray-700 mb-6">{featuredEvent.description}</p>
                  <Link to={`/events/${featuredEvent._id}`} className="bg-blue-600 text-white py-2 px-6 rounded-full font-bold hover:bg-blue-700 transition duration-300">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Carousel */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">All Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <motion.div
                key={event._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img src={event.img} alt={event.heading} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.heading}</h3>
                  <div className="flex items-center mb-2 text-gray-600">
                    <FaCalendarAlt className="mr-2 text-sm" />
                    <p className="text-sm">{event.date.day} {event.date.month} {event.date.year}</p>
                  </div>
                  <div className="flex items-center mb-2 text-gray-600">
                    <FaClock className="mr-2 text-sm" />
                    <p className="text-sm">{event.time}</p>
                  </div>
                  <div className="flex items-center mb-2 text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-sm" />
                    <p className="text-sm">{event.location}</p>
                  </div>
                  <div className="flex items-center mb-2 text-purple-600">
                    <FaTag className="mr-2 text-sm" />
                    <p className="text-sm">Category: {event.category}</p>
                  </div>
                  <div className="flex items-center mb-2 text-blue-600">
                    <FaUser className="mr-2 text-sm" />
                    <p className="text-sm">Organizer: {event.organizer}</p>
                  </div>
                  <Link to={`/events/${event._id}`} className="text-blue-600 font-bold hover:underline">
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2 
            className="text-5xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Ready to Host Your Own Event?
          </motion.h2>
          {user ? (
            <motion.div
              className="inline-block relative"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <Link 
                to="/add-event" 
                className="bg-white text-blue-600 py-4 px-10 rounded-full font-bold text-xl shadow-lg inline-flex items-center group transition-all duration-300 ease-in-out transform hover:scale-105 hover:rotate-3"
              >
                <span className="mr-2">Create Event Now</span>
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 inline-block transition-transform duration-300 ease-in-out transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={{ x: isHovered ? 5 : 0 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </Link>
            </motion.div>
          ) : (
            <Link 
              to="/login" 
              className="bg-white text-blue-600 py-4 px-10 rounded-full font-bold text-xl shadow-lg inline-flex items-center group transition-all duration-300 ease-in-out transform hover:scale-105 hover:rotate-3"
            >
              Login to Create Events
            </Link>
          )}
        </div>
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(20)].map((_, index) => (
            <motion.div
              key={index}
              className="absolute bg-white rounded-full opacity-10"
              style={{
                width: Math.random() * 50 + 10,
                height: Math.random() * 50 + 10,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                scale: [1, Math.random() + 0.5],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;