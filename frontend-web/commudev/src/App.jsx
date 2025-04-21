// src/App.jsx
import React from 'react';
import AppRoutes from './routes';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;