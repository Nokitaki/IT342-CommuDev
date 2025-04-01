// src/layouts/AuthLayout.jsx
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Card,
  Box,
  Typography,
} from '@mui/material';
import logo from '../assets/images/logo.png';

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// Styles
const styles = {
  mainContainer: {
    minHeight: '100vh',
    background: '#e4efe4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  card: {
    display: 'flex',
    width: '100%',
    maxWidth: '1200px',
    minHeight: '600px',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    background: 'white',
  },
  leftSection: {
    flex: 1,
    background: `linear-gradient(135deg, #99FF99 0%, #2196F3 100%)`,
    display: { xs: 'none', md: 'flex' },
    flexDirection: 'column',
    position: 'relative',
    padding: '3rem',
    color: 'white',
  },
  rightSection: {
    flex: 1,
    background: 'white',
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
  },
};

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={styles.mainContainer}>
        <Card sx={styles.card}>
          {/* Left Section */}
          <Box sx={styles.leftSection}>
            <Typography variant="h3" component="h1" sx={{ color: '#40694b', mb: 2, fontWeight: 'bold' }}>
              CommuDev
            </Typography>
            <Typography variant="h6" sx={{ color: '#40694b', mb: 4 }}>
              Connect. Collaborate. Create.
            </Typography>
            <Box 
              component="img" 
              src={logo}
              alt="Decorative"
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '16px',
                mt: 'auto'
              }}
            />
          </Box>

          {/* Right Section */}
          <Box sx={styles.rightSection}>
            <Box sx={styles.formContainer}>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}
              >
                {title || 'Welcome'}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}
              >
                {subtitle}
              </Typography>
              
              {children}
            </Box>
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default AuthLayout;