import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Typography from '@mui/material/Typography';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { PageContext } from '../../contexts/pageContexts';

// Tabbing Shit
import { Tabs, Tab } from '@mui/material';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  
  // Core glassmorphism properties
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',  // Safari
  
  // Semi-transparent background (key!)
  backgroundColor: '',  // 60% opacity
  
  // Subtle border with transparency
  border: '1px solid rgba(255, 255, 255, 0.5)',
  
  // Stronger shadow for depth
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  
  padding: '15px 24px',
  
  // Optional: add a subtle highlight on top edge
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
  },
}));

// Temporary Sitemark placeholder
const Sitemark = ({ setCurrentPage }: { setCurrentPage: (page: string) => void }) => (
  <Typography 
    variant="h6" 
    component="a"
    onClick={() => setCurrentPage('index')}
    sx={{ 
      fontWeight: 'bold', 
      mr: 3, 
      fontSize: "20px",
      textDecoration: 'none',
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        fontSize: "23px",
        textShadow: '0 0 10px #4a90e2, 0 0 20px #4a90e2, 0 0 40px #4a90e2',
        color: "#fff"
        
      }
      
    }}
  >
    Strokify
  </Typography>
);

// Temporary ColorModeIconDropdown placeholder
const ColorModeIconDropdown = ({ size }: { size?: 'small' | 'medium' }) => (
  <IconButton size={size}>
    <Brightness4Icon />
  </IconButton>
);

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);

  // Tabs
  
  const { setCurrentPage } = React.useContext(PageContext);


  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };



  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
        margin: '10px',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0, }}>
            <Sitemark setCurrentPage={setCurrentPage} />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" color="info" size="small" 
              onClick={() => setCurrentPage('features')}>
                Features
              </Button>
              <Button variant="text" color="info" size="small"
              onClick={() => setCurrentPage('terms')}
              >
                Terms
              </Button>
              <Button variant="text" color="info" size="small"
              onClick={() => setCurrentPage('highlights')}>
                Highlights
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}
              onClick={() => setCurrentPage('about')}>
                About
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}
              onClick={() => setCurrentPage('blog')}>
                Blog
              </Button>
             
            </Box>

            
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Button sx={{ display: {}, color: 'red', fontSize: '18px', fontWeight: '50px'}}
            onClick={() => setCurrentPage('support')}>
              Support Us
            </Button>
       
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                  <MenuItem onClick={() => setCurrentPage('features')}>Features</MenuItem>
                  <MenuItem onClick={() => setCurrentPage('terms')}>Terms</MenuItem>
                  <MenuItem onClick={() => setCurrentPage('highlights')}>Highlights</MenuItem>
                  <MenuItem onClick={() => setCurrentPage('about')}>About</MenuItem>
                  <MenuItem onClick={() => setCurrentPage('blog')}>Blog</MenuItem>
                
                <Divider sx={{ my: 3 }} />
             
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}