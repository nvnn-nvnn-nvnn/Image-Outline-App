import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import { PageContext } from '../../contexts/pageContexts';

export default function Footer() {
  // Fallback if PageContext isn't available
  const context = React.useContext(PageContext);
  const setCurrentPage = context?.setCurrentPage || ((page) => console.log('Navigate to:', page));
  
  const handleNavigation = (page) => (e) => {
    e.preventDefault();
    setCurrentPage(page);
  };
  
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#181b20",
        color: "#fff",
        py: { xs: 4, sm: 6, md: 8 },
        mt: { xs: 6, sm: 8 },
        width: '100%',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Main Content Row */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 3, sm: 4, md: 6 },
            mb: { xs: 3, sm: 4 },
          }}
        >
          {/* Left Section - Newsletter */}
          <Box sx={{ flex: 1, maxWidth: { md: '400px' }, width: '100%' }}>
            <Typography 
              variant="h6" 
              component="h2"
              sx={{ 
                color: '#3b82f6', 
                mb: { xs: 1.5, sm: 2 },
                fontSize: { xs: '1.125rem', sm: '1.25rem' }
              }}
            >
              Strokify
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600, 
                mb: 0.5,
                fontSize: { xs: '0.875rem', sm: '0.9375rem' }
              }}
            >
              Join the newsletter
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#9ca3af', 
                mb: { xs: 1.5, sm: 2 },
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                lineHeight: 1.5
              }}
            >
              Subscribe for weekly updates. No spams ever! EVER EVER Just updates only
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 1, sm: 1 }}
              sx={{ width: '100%' }}
            >
              <TextField
                size="small"
                type="email"
                placeholder="Your email address"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#252932',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    '& fieldset': { borderColor: '#3a3f4b' },
                    '&:hover fieldset': { borderColor: '#4a5568' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                  },
                  '& input': { 
                    color: '#fff',
                    py: { xs: 1.25, sm: 1.5 }
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#3b82f6',
                  '&:hover': { backgroundColor: '#2563eb' },
                  flexShrink: 0,
                  minHeight: { xs: '44px', sm: '40px' },
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                  width: { xs: '100%', sm: 'auto' },
                  px: { xs: 2, sm: 3 },
                  textTransform: 'none',
                }}
              >
                Subscribe
              </Button>
            </Stack>
          </Box>

          {/* Right Section - Links */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { 
                xs: 'repeat(2, 1fr)', 
                sm: 'repeat(3, 1fr)',
                md: 'repeat(3, minmax(120px, 1fr))' 
              },
              gap: { xs: 3, sm: 4, md: 6 },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            {/* Product Column */}
            <Box>
              <Typography 
                variant="body2" 
                component="h3"
                sx={{ 
                  fontWeight: 600, 
                  mb: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                }}
              >
                Product
              </Typography>
              <Stack spacing={{ xs: 0.75, sm: 1 }} component="nav">
                <Link 
                  href="#features" 
                  sx={{ 
                    color: '#9ca3af', 
                    textDecoration: 'none', 
                    '&:hover': { color: '#fff' },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    display: 'block',
                    py: 0.25,
                    cursor: 'pointer',
                  }}
                  onClick={handleNavigation('features')}
                >
                  Features
                </Link>
                <Link 
                  href="#highlights" 
                  sx={{ 
                    color: '#9ca3af', 
                    textDecoration: 'none', 
                    '&:hover': { color: '#fff' },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    display: 'block',
                    py: 0.25,
                    cursor: 'pointer',
                  }}
                  onClick={handleNavigation('highlights')}
                >
                  Highlights
                </Link>
                <Link 
                  href="#about" 
                  sx={{ 
                    color: '#9ca3af', 
                    textDecoration: 'none', 
                    '&:hover': { color: '#fff' },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    display: 'block',
                    py: 0.25,
                    cursor: 'pointer',
                  }}
                  onClick={handleNavigation('about')}
                >
                  About
                </Link>
                <Link 
                  href="#blog" 
                  sx={{ 
                    color: '#9ca3af', 
                    textDecoration: 'none', 
                    '&:hover': { color: '#fff' },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    display: 'block',
                    py: 0.25,
                    cursor: 'pointer',
                  }}
                  onClick={handleNavigation('blog')}
                >
                  Blog
                </Link>
              </Stack>
            </Box>

            {/* Company Column */}
            <Box>
              <Typography 
                variant="body2" 
                component="h3"
                sx={{ 
                  fontWeight: 600, 
                  mb: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                }}
              >
                Company
              </Typography>
              <Stack spacing={{ xs: 0.75, sm: 1 }} component="nav">
                <Link 
                  href="#about" 
                  sx={{ 
                    color: '#9ca3af', 
                    textDecoration: 'none', 
                    '&:hover': { color: '#fff' },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    display: 'block',
                    py: 0.25,
                    cursor: 'pointer',
                  }}
                  onClick={handleNavigation('about')}
                >
                  About us
                </Link>
                <Link 
                  href="https://devanlee.me" 
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: '#9ca3af', 
                    textDecoration: 'none', 
                    '&:hover': { color: '#fff' },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    display: 'block',
                    py: 0.25,
                  }}
                >
                  Developer
                </Link>
                <Link 
                  href="#github" 
                  sx={{ 
                    color: '#9ca3af', 
                    textDecoration: 'none', 
                    '&:hover': { color: '#fff' },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    display: 'block',
                    py: 0.25,
                  }}
                >
                  Github
                </Link>
                <Link 
                  href="https://www.youtube.com/watch?v=xMHJGd3wwZk" 
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: '#9ca3af', 
                    textDecoration: 'none', 
                    '&:hover': { color: '#fff' },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    display: 'block',
                    py: 0.25,
                  }}
                >
                  DONT CLICK THIS LINK!
                </Link>
              </Stack>
            </Box>

            {/* Legal Column */}
            <Box sx={{ gridColumn: { xs: 'span 2', sm: 'auto' } }}>
              <Typography 
                variant="body2" 
                component="h3"
                sx={{ 
                  fontWeight: 600, 
                  mb: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                }}
              >
                Legal
              </Typography>
              <Stack spacing={{ xs: 0.75, sm: 1 }} component="nav">
                <Link 
                  href="#terms" 
                  sx={{ 
                    color: '#9ca3af', 
                    textDecoration: 'none', 
                    '&:hover': { color: '#fff' },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    display: 'block',
                    py: 0.25,
                    cursor: 'pointer',
                  }}
                  onClick={handleNavigation('terms')}
                >
                  Terms
                </Link>
                <Link 
                  href="#privacy" 
                  sx={{ 
                    color: '#9ca3af', 
                    textDecoration: 'none', 
                    '&:hover': { color: '#fff' },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    display: 'block',
                    py: 0.25,
                    cursor: 'pointer',
                  }}
                  onClick={handleNavigation('privacy')}
                >
                  Privacy
                </Link>
                <Link 
                  href="#contact" 
                  sx={{ 
                    color: '#9ca3af', 
                    textDecoration: 'none', 
                    '&:hover': { color: '#fff' },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    display: 'block',
                    py: 0.25,
                    cursor: 'pointer',
                  }}
                  onClick={handleNavigation('contact')}
                >
                  Contact
                </Link>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Bottom Section - Copyright & Social */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            pt: { xs: 3, sm: 4 },
            borderTop: '1px solid #3a3f4b',
            gap: { xs: 2, sm: 2 },
          }}
        >
          {/* Left - Links & Copyright */}
          <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1, 
                mb: 1, 
                flexWrap: 'wrap',
                alignItems: 'center'
              }}
            >
              <Link 
                href="#privacy" 
                sx={{ 
                  color: '#9ca3af', 
                  textDecoration: 'none', 
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  '&:hover': { color: '#fff' },
                  cursor: 'pointer',
                }}
                onClick={handleNavigation('privacy')}
              >
                Privacy Policy
              </Link>
              <Typography sx={{ color: '#9ca3af', fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                •
              </Typography>
              <Link 
                href="#tos" 
                sx={{ 
                  color: '#9ca3af', 
                  textDecoration: 'none', 
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  '&:hover': { color: '#fff' },
                  cursor: 'pointer',
                }}
                onClick={handleNavigation('tos')}
              >
                Terms of Service
              </Link>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6b7280', 
                fontSize: { xs: '0.8125rem', sm: '0.875rem' }
              }}
            >
              Copyright © Devan Lee {new Date().getFullYear()}
            </Typography>
          </Box>

          {/* Right - Social Icons */}
          <Stack 
            direction="row" 
            spacing={1}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'flex-start', sm: 'flex-end' }
            }}
          >
            <IconButton
              href="#github"
              aria-label="GitHub"
              sx={{ 
                color: '#9ca3af', 
                '&:hover': { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                p: { xs: 1.5, sm: 1 }
              }}
              size="small"
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton
              href="#twitter"
              aria-label="Twitter"
              sx={{ 
                color: '#9ca3af', 
                '&:hover': { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                p: { xs: 1.5, sm: 1 }
              }}
              size="small"
            >
              <TwitterIcon fontSize="small" />
            </IconButton>
            <IconButton
              href="https://www.linkedin.com/in/devan-lee-0488b1289/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              sx={{ 
                color: '#9ca3af', 
                '&:hover': { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                p: { xs: 1.5, sm: 1 }
              }}
              size="small"
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}