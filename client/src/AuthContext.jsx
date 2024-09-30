import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    if (!userData.id) {
      console.error('Login data is missing user id');
      return;
    }
    
    const userToStore = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      collegeId: userData.collegeId || '', // Use an empty string if collegeId is undefined
      isAdmin: userData.isAdmin
    };
    
    console.log('User data being stored in AuthContext:', userToStore); // Add this line
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);