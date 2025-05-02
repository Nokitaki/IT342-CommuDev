// src/App.jsx
import React, { useEffect } from 'react';
import AppRoutes from './routes';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import AuthDebugger from './components/debug/AuthDebugger';
import { initializeStorage } from './utils/setupSupabaseStorage';

function App() {
  // Initialize Supabase storage when the app loads or when authentication changes
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Initialize only if authenticated
      initializeStorage();
    }
    
    // Listen for login events
    const handleStorageChange = (e) => {
      if (e.key === 'token' && e.newValue) {
        // User logged in, initialize storage
        initializeStorage();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthProvider>
      <AppRoutes />
      {process.env.NODE_ENV === 'development' && <AuthDebugger />}
    </AuthProvider>
  );
}

export default App;