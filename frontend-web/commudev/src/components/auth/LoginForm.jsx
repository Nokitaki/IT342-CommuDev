import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  InputAdornment,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  Email as EmailIcon,
} from '@mui/icons-material';
import PasswordField from '../ui/PasswordField';
import SocialButtons from '../ui/SocialButtons';
import useAuth from '../../hooks/useAuth';

const styles = {
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: 'white',
      '&.Mui-focused': {
        boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.2)',
      },
    },
  },
  submitButton: {
    height: 48,
    borderRadius: '12px',
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 600,
    '&:hover': {
      background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
    },
  },
};

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const { loading, error, successMessage, handleLogin } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData);
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
          {successMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            required
            fullWidth
            id="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            sx={styles.textField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <PasswordField 
            value={formData.password}
            onChange={handleChange}
          />

          <Typography 
            variant="body2" 
            align="right" 
            sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            Forgot your password?
          </Typography>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={styles.submitButton}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'LOGIN'
            )}
          </Button>
        </Stack>
      </form>

      <SocialButtons />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link
            component={RouterLink}
            to="/register"
            variant="body2"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Register Now
          </Link>
        </Typography>
      </Box>
    </>
  );
};

export default LoginForm;