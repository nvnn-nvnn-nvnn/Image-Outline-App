import * as React from 'react';
import Box from '@mui/material/Box';

export default function Sitemark() {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: 'primary.main',
      }}
    >
      Logo
    </Box>
  );
}