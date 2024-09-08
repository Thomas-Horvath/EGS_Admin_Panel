import React, { createContext, useState, useEffect } from 'react';

// AuthContext létrehozása
export const AuthContext = createContext();

// AuthProvider komponens létrehozása
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Ellenőrizzük, hogy van-e token a sessionStorage-ban
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (token) => {
    sessionStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
