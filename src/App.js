import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // AuthContext importálása
import AuthRoutes from './components/AuthRoutes';

function App() {
  const [isOpen, setIsOpen] = useState((window.innerWidth > 768));
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }else {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsOpen]);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AuthRoutes isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
