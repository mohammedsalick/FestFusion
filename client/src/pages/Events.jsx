import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaTag, FaSearch, FaClock, FaEnvelope, FaPhone } from 'react-icons/fa';
import axios from 'axios'; // Make sure to install axios: npm install axios

const Events = () => {
  const [events, setEvents] = useState([]);
  const [yearFilter, setYearFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const location = useLocation();

  const categories = [
    'Technology', 'Business', 'Science', 'Arts', 'Sports', 'Music', 'Education', 'Other'
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);

      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => 
    (yearFilter === 'all' || event.date.year === parseInt(yearFilter)) &&
    (categoryFilter === 'all' || event.category === categoryFilter) &&
    (event.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
     event.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const years = [...new Set(events.map(event => event.date.year))].sort((a, b) => b - a);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, yearFilter, categoryFilter]);

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 pt-24 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Discover Epic Events
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Explore our curated collection of extraordinary events and find your next adventure.
          </p>
        </motion.div>

        <motion.div 
          className="mb-12 bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
            <div className="mb-4 sm:mb-0 sm:w-1/3">
              <label htmlFor="year-filter" className="block text-lg font-medium text-gray-700 mb-2  items-center">
                <FaCalendar className="mr-2 text-blue-600" />
                Year
              </label>
              <select
                id="year-filter"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm transition duration-150 ease-in-out"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="mb-4 sm:mb-0 sm:w-1/3">
              <label htmlFor="category-filter" className="block text-lg font-medium text-gray-700 mb-2  items-center">
                <FaTag className="mr-2 text-purple-600" />
                Category
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm transition duration-150 ease-in-out"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="sm:w-1/3">
              <label htmlFor="search" className="block text-lg font-medium text-gray-700 mb-2  items-center">
                <FaSearch className="mr-2 text-gray-600" />
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events..."
                  className="mt-1 block w-full pl-10 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm transition duration-150 ease-in-out"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {filteredEvents.map((event) => (
              <motion.div
                key={event._id}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <Link to={`/events/${event._id}`} className="block">
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative">
                      <img src={event.img} alt={event.heading} className="w-full h-48 object-cover" />
                      <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg flex items-center">
                        <FaCalendar className="mr-2" />
                        {event.date.day} {event.date.month} {event.date.year}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-800">{event.heading}</h3>
                      <p className="text-gray-600 mb-1 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-blue-600" />
                        {event.location}
                      </p>
                      <p className="text-gray-600 mb-1 flex items-center">
                        <FaClock className="mr-2 text-blue-600" />
                        {event.time}
                      </p>
                      <p className="text-sm text-blue-600 mb-2 flex items-center">
                        <FaUsers className="mr-2" />
                        Organizer: {event.organizer}
                      </p>
                      <p className="text-sm font-medium text-purple-600 mb-3">Category: {event.category}</p>
                      <p className="text-gray-700 line-clamp-3">{event.description}</p>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 flex flex-col">
                      <span className="text-sm text-gray-600 flex items-center mb-2">
                        <FaUsers className="mr-2 text-blue-600" />
                        {event.registeredUsers.length} / {event.maxRegistrations} attendees
                      </span>
                      <span className="text-sm text-gray-600 flex items-center mb-2">
                        <FaEnvelope className="mr-2 text-blue-600" />
                        {event.contactEmail}
                      </span>
                      <span className="text-sm text-gray-600 flex items-center mb-2">
                        <FaPhone className="mr-2 text-blue-600" />
                        {event.contactPhone}
                      </span>
                      <span className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300 flex items-center mt-2">
                        View Details 
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredEvents.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-xl text-gray-700 mt-12"
          >
            No events found for the selected filters. Try different criteria!
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default Events;