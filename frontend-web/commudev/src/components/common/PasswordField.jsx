// src/components/ui/PasswordField.jsx
import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
} from '@mui/icons-material';

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
};

const PasswordField = ({ value, onChange, id = "password", label = "Password", required = true }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      required={required}
      fullWidth
      id={id}
      name={id}
      label={label}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      sx={styles.textField}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockIcon color="primary" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;