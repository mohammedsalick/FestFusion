import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdHome, MdEvent, MdAddCircleOutline, MdPerson, MdLogin, MdLogout, MdDashboard, MdAccountCircle } from 'react-icons/md';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: MdHome },
    { name: 'Events', path: '/events', icon: MdEvent },
    ...(user ? [
      { name: 'Add Event', path: '/add-event', icon: MdAddCircleOutline },
      { name: 'My Events', path: '/my-events', icon: MdPerson },
      { name: 'Profile', path: '/profile', icon: MdAccountCircle },
      ...(user.isAdmin ? [{ name: 'Admin', path: '/admin-dashboard', icon: MdDashboard }] : []),
      { name: 'Logout', path: '#', icon: MdLogout, onClick: handleLogout }
    ] : [
      { name: 'Login', path: '/login', icon: MdLogin },
      { name: 'Register', path: '/register', icon: MdPerson }
    ])
  ];

  return (
    <motion.nav 
      className="fixed bottom-4 left-4 right-4 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-lg max-w-md mx-auto border border-gray-200">
        <div className="flex justify-around items-center p-2 text-center">
          {navItems.map((item) => (
            <NavItem key={item.name} item={item} isActive={location.pathname === item.path} />
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

const NavItem = ({ item, isActive }) => {
  const Icon = item.icon;
  return (
    item.onClick ? (
      <button onClick={item.onClick} className="w-full">
        <NavItemContent item={item} isActive={isActive} Icon={Icon} />
      </button>
    ) : (
      <Link to={item.path} className="w-full">
        <NavItemContent item={item} isActive={isActive} Icon={Icon} />
      </Link>
    )
  );
};

const NavItemContent = ({ item, isActive, Icon }) => (
  <motion.div
    className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-colors duration-300 ${
      isActive 
        ? 'bg-blue-100 text-blue-600' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
    <span className="text-xs mt-1 font-medium">{item.name}</span>
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      )}
    </AnimatePresence>
  </motion.div>
);

export default Navbar;