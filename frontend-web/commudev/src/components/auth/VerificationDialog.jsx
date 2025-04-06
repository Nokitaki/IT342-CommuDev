// src/components/auth/VerificationDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';

const VerificationDialog = ({
  open,
  onClose,
  email,
  verificationCode,
  setVerificationCode,
  onSubmit,
  onResend,
  loading
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Verify Your Account</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            Please enter the verification code sent to your email address: <strong>{email}</strong>
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            variant="outlined"
            placeholder="Enter 6-digit code"
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Didn't receive a code? Check your spam folder or
          <Button
            onClick={onResend}
            color="primary"
            disabled={loading}
            sx={{ textTransform: 'none', ml: 1 }}
          >
            Resend Code
          </Button>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          color="primary"
          variant="contained"
          disabled={!verificationCode || loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          Verify Account
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerificationDialog;