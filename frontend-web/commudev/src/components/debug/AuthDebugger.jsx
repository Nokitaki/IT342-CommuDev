// Create a new file called AuthDebugger.jsx
import React, { useEffect, useState } from 'react';
import { isTokenExpired, clearAuthData } from '../../services/api';

const AuthDebugger = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isExpired, setIsExpired] = useState(isTokenExpired());

  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem('token');
      setToken(currentToken);
      setIsExpired(isTokenExpired());
    };

    checkToken();
    const interval = setInterval(checkToken, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearAuth = () => {
    clearAuthData();
    window.location.href = '/login';
  };

  if (!token) return (
    <div style={{padding: '10px', backgroundColor: '#ffcccc', color: 'red', position: 'fixed', bottom: 0, width: '100%', zIndex: 9999}}>
      No auth token found. <button onClick={() => window.location.href = '/login'}>Log in</button>
    </div>
  );

  return (
    <div style={{padding: '10px', backgroundColor: isExpired ? '#ffcccc' : '#ccffcc', color: isExpired ? 'red' : 'green', position: 'fixed', bottom: 0, width: '100%', zIndex: 9999}}>
      {isExpired ? 'Token expired.' : 'Token valid.'} 
      <button onClick={handleClearAuth}>Clear Auth & Logout</button>
    </div>
  );
};

export default AuthDebugger;