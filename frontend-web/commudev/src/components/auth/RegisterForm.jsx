import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    middleinit: '',
    dateOfBirth: '',
    age: '',
    state: '',
    employmentStatus: '',
    email: ''
  });
  
  const { loading, error, successMessage, handleRegister } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(formData, () => {
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login', { state: { username: formData.username } });
      }, 1500);
    });
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
          />

          <PasswordField 
            value={formData.password}
            onChange={handleChange}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              required
              fullWidth
              id="firstname"
              label="First Name"
              value={formData.firstname}
              onChange={handleChange}
              sx={styles.textField}
            />
            <TextField
              required
              fullWidth
              id="lastname"
              label="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              sx={styles.textField}
            />
          </Stack>

          <TextField
            fullWidth
            id="email"
            label="Email"
            type="email"
            value={formData.email}
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

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              id="age"
              label="Age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              sx={styles.textField}
            />
            <TextField
              fullWidth
              id="state"
              label="State"
              value={formData.state}
              onChange={handleChange}
              sx={styles.textField}
            />
          </Stack>

          <TextField
            fullWidth
            id="employmentStatus"
            label="Employment Status"
            value={formData.employmentStatus}
            onChange={handleChange}
            sx={styles.textField}
          />

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={styles.submitButton}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'REGISTER'
            )}
          </Button>
        </Stack>
      </form>

      <SocialButtons />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link
            component={RouterLink}
            to="/login"
            variant="body2"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Login Now
          </Link>
        </Typography>
      </Box>
    </>
  );
};

export default RegisterForm;