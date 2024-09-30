import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const FeedbackForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch event details. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (feedback.trim() && userName.trim()) {
      try {
        const response = await axios.post(`http://localhost:5000/api/events/${id}/feedback`, {
          user: userName,
          comment: feedback
        });
        setEvent(response.data);
        toast.success('Feedback submitted successfully!');
        setTimeout(() => navigate(`/events/${id}`), 2000);
      } catch (err) {
        toast.error('Failed to submit feedback. Please try again.');
      }
    } else {
      toast.error('Please enter your name and feedback before submitting.');
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  if (!event) {
    return <div className="text-center py-20">Event not found.</div>;
  }

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Feedback for {event.heading}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="4"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 px-4 rounded-full text-white font-bold text-lg bg-blue-600 hover:bg-blue-700 transition duration-300"
            >
              Submit Feedback
            </motion.button>
          </form>
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FeedbackForm;
