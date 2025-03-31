// src/components/ui/SocialButtons.jsx
import React from 'react';
import {
  Button,
  Stack,
  Link,
  Divider,
  Typography,
  Box
} from '@mui/material';
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
} from '@mui/icons-material';

const styles = {
  socialButton: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
};

const SocialButtons = () => {
  return (
    <>
      <Box sx={{ my: 3 }}>
        <Divider>
          <Typography variant="body2" sx={{ color: 'text.secondary', px: 2 }}>
            OR
          </Typography>
        </Divider>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        <Link href="#" underline="none">
          <Button variant="outlined" sx={styles.socialButton}>
            <GoogleIcon />
          </Button>
        </Link>
        <Link href="#" underline="none">
          <Button variant="outlined" sx={styles.socialButton}>
            <FacebookIcon />
          </Button>
        </Link>
        <Link href="#" underline="none">
          <Button variant="outlined" sx={styles.socialButton}>
            <AppleIcon />
          </Button>
        </Link>
      </Stack>
    </>
  );
};

export default SocialButtons;