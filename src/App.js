import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // AuthContext importálása
import AuthRoutes from './components/AuthRoutes';

function App() {
  const [isOpen, setIsOpen] = useState(true);

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
