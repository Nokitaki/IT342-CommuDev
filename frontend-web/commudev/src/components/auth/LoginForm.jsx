// src/components/auth/LoginForm.jsx
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

const LoginForm = ({ initialUsername = '' }) => {
  const [formData, setFormData] = useState({
    username: initialUsername,
    password: ''
  });
  
  const { 
    loading, 
    error, 
    success, 
    handleLogin, 
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

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData);
  };

  // Show verification dialog when needed
  React.useEffect(() => {
    if (needsVerification) {
      setVerificationOpen(true);
    }
  }, [needsVerification]);

  // Handle verification submit
  const handleVerificationSubmit = () => {
    handleVerify(pendingVerificationEmail, verificationCode);
  };

  // Handle resend code
  const handleResendVerification = () => {
    handleResendCode(pendingVerificationEmail);
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
          <TextField
            required
            fullWidth
            id="username"
            label="Email"
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
            <Link component={RouterLink} to="/forgot-password">
              Forgot your password?
            </Link>
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

      <Box sx={{ textAlign: 'center', mt: 3 }}>
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

      {/* Verification Dialog */}
      <VerificationDialog
        open={verificationOpen}
        onClose={() => setVerificationOpen(false)}
        email={pendingVerificationEmail}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        onSubmit={handleVerificationSubmit}
        onResend={handleResendVerification}
        loading={loading}
      />
    </>
  );
};

export default LoginForm;