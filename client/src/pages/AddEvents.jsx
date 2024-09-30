import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const AddEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    heading: '',
    date: { month: '', year: '', day: '' },
    time: '',
    location: '',
    description: '',
    img: '',
    collegeId: '',
    category: '',
    maxRegistrations: '',  // Change this to an empty string
    registeredUsers: [],
    organizer: '',
    organizerId: '',
    organizerCollegeId: '',
    contactEmail: '',
    contactPhone: '',
    registrationDeadline: ''
  });

  const categories = [
    'Technology',
    'Business',
    'Science',
    'Arts',
    'Sports',
    'Music',
    'Education',
    'Other'
  ];

  useEffect(() => {
    console.log('User in AddEvent:', user); // Keep this line
    if (!user) {
      navigate('/login');
    } else {
      setEventData(prevState => {
        const newState = {
          ...prevState,
          collegeId: user.collegeId || '', // Use an empty string if collegeId is undefined
          organizer: user.username || '',
          organizerId: user.id || '',
          organizerCollegeId: user.collegeId || '' // Use an empty string if collegeId is undefined
        };
        console.log('Updated eventData:', newState); // Keep this line
        return newState;
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'month' || name === 'year' || name === 'day') {
      setEventData(prevState => ({
        ...prevState,
        date: {
          ...prevState.date,
          [name]: value
        }
      }));
    } else {
      setEventData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!eventData.collegeId.trim()) {
        toast.error('Please enter a valid College ID.');
        return;
      }

      if (!eventData.category) {
        toast.error('Please select a category for the event.');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/events', eventData);
      
      if (response.status === 201) {
        toast.success('Event added successfully!');
        setEventData({
          heading: '',
          date: { month: '', year: '', day: '' },
          time: '',
          location: '',
          description: '',
          img: '',
          collegeId: '',
          category: '',
          maxRegistrations: 0,
          registeredUsers: [],
          organizer: '',
          contactEmail: '',
          contactPhone: '',
          registrationDeadline: ''
        });
        setTimeout(() => navigate('/events'), 2000);
      } else {
        toast.error('Failed to add event. Please try again.');
      }
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);
      toast.error(`Failed to add event: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 py-12 px-4 sm:px-6 lg:px-8 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Create Your Epic Event
        </h1>
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                <div>
                  <label htmlFor="heading" className="block text-sm font-medium text-gray-700">Event Name</label>
                  <input type="text" id="heading" name="heading" value={eventData.heading} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={eventData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="day" className="block text-sm font-medium text-gray-700">Day</label>
                  <input type="number" id="day" name="day" value={eventData.date.day} onChange={handleChange} min="1" max="31" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
                  <input type="text" id="month" name="month" value={eventData.date.month} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                  <input type="number" id="year" name="year" value={eventData.date.year} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                  <input type="time" id="time" name="time" value={eventData.time} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <input type="text" id="location" name="location" value={eventData.location} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea id="description" name="description" value={eventData.description} onChange={handleChange} rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required></textarea>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="img" className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input type="url" id="img" name="img" value={eventData.img} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="collegeId" className="block text-sm font-medium text-gray-700">College ID</label>
                  <input
                    type="text"
                    id="collegeId"
                    name="collegeId"
                    value={eventData.collegeId || ''}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="maxRegistrations" className="block text-sm font-medium text-gray-700">Maximum Registrations</label>
                  <input type="number" id="maxRegistrations" name="maxRegistrations" value={eventData.maxRegistrations} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">Organizer</label>
                  <input type="text" id="organizer" name="organizer" value={eventData.organizer} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
                  <input type="email" id="contactEmail" name="contactEmail" value={eventData.contactEmail} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
                  <input type="tel" id="contactPhone" name="contactPhone" value={eventData.contactPhone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700">Registration Deadline</label>
                  <input type="date" id="registrationDeadline" name="registrationDeadline" value={eventData.registrationDeadline} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
              </div>
              <div className="pt-5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Event
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default AddEvent;