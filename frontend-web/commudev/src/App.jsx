// src/App.jsx
import React from 'react';
import AppRoutes from './routes';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import AuthDebugger from './components/debug/AuthDebugger';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      {process.env.NODE_ENV === 'development' && <AuthDebugger />}
    </AuthProvider>
  );
}

export default App;