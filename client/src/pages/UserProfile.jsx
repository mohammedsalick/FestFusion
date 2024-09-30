import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${user.id}`);
      setUserDetails(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user details. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">User Profile</h1>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Your Profile
        </h1>
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <p className="text-lg font-semibold">{userDetails?.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-lg font-semibold">{userDetails?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">College ID</label>
                <p className="text-lg font-semibold">{userDetails?.collegeId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <p className="text-lg font-semibold">{userDetails?.isAdmin ? 'Admin' : 'User'}</p>
              </div>
            </div>
            {userDetails?.collegeIdImage && (
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">College ID Image</label>
                <img 
                  src={`http://localhost:5000/${userDetails.collegeIdImage}`} 
                  alt="College ID" 
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
            <div className="mt-8">
              <button
                onClick={logout}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;