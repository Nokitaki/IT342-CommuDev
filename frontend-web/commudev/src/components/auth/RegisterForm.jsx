// src/components/auth/RegisterForm.jsx
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
  Stack,
  Grid
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import PasswordField from '../ui/PasswordField';
import VerificationDialog from './VerificationDialog';
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
    email: '',
    password: '',
    firstname: '',
    lastname: ''
  });
  
  const { 
    loading, 
    error, 
    success, 
    handleRegister,
    needsVerification,
    pendingVerificationEmail,
    handleVerify,
    handleResendCode
  } = useAuth();

  const [verificationCode, setVerificationCode] = useState('');
  const [verificationOpen, setVerificationOpen] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await handleRegister(formData);
    if (result) {
      // If registration is successful, show verification dialog
      setVerificationOpen(true);
    }
  };

  // Show verification dialog when needed
  React.useEffect(() => {
    if (needsVerification) {
      setVerificationOpen(true);
    }
  }, [needsVerification]);

  // Handle verification submit
  const handleVerificationSubmit = async () => {
    const success = await handleVerify(pendingVerificationEmail, verificationCode);
    if (success) {
      // Close dialog and redirect to login after successful verification
      setVerificationOpen(false);
      setTimeout(() => {
        navigate('/login', { state: { username: formData.email } });
      }, 1500);
    }
  };

  // Handle resend code
  const handleResendVerification = () => {
    handleResendCode(pendingVerificationEmail || formData.email);
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="firstname"
                label="First Name"
                value={formData.firstname}
                onChange={handleChange}
                sx={styles.textField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastname"
                label="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                sx={styles.textField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

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
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            required
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

          <PasswordField 
            value={formData.password}
            onChange={handleChange}
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

      <Box sx={{ textAlign: 'center', mt: 3 }}>
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

      {/* Verification Dialog */}
      <VerificationDialog
        open={verificationOpen}
        onClose={() => setVerificationOpen(false)}
        email={pendingVerificationEmail || formData.email}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        onSubmit={handleVerificationSubmit}
        onResend={handleResendVerification}
        loading={loading}
      />
    </>
  );
};

export default RegisterForm;