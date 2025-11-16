import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface ColorModeIconDropdownProps {
  size?: 'small' | 'medium' | 'large';
}

export default function ColorModeIconDropdown({ size = 'small' }: ColorModeIconDropdownProps) {
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <IconButton onClick={toggleColorMode} color="inherit" size={size}>
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}