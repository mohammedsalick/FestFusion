import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import AddEvent from './pages/AddEvents';
import MyEvents from './pages/MyEvents';
import Login from './pages/Login';
import Register from './pages/Register';
import FeedbackForm from './components/FeedbackForm';
import Navbar from './components/Navbar';
import UserProfile from './pages/UserProfile'; // Add this import

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/add-event" element={<AddEvent />} />
              <Route path="/my-events" element={<MyEvents />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events/:id/feedback" element={<FeedbackForm />} />
              <Route path="/profile" element={<UserProfile />} /> {/* Add this line */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


