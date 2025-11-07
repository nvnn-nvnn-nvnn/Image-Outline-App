import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import SitemarkIcon from "../AppAppBar/SitemarkIcon";
import { PageContext } from '../../contexts/pageContexts';


function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <Link color="text.secondary" href="https://mui.com/">
        Sitemark
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  const { setCurrentPage } = React.useContext(PageContext);
  return (
    <Box
      sx={{
        backgroundColor: "#181b20",
        color: "#fff",
        py: { xs: 6, sm: 8 },
        mt: 8, // Add margin top to separate from content above
      }}
    >
      <Container maxWidth="lg">
        {/* Main Content Row */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 4, sm: 6 },
            mb: 4,
          }}
        >
          {/* Left Section - Newsletter */}
          <Box sx={{ flex: 1, maxWidth: { sm: '400px' } }}>
            <Typography variant="h6" sx={{ color: '#3b82f6', mb: 2 }}>
              Strokify
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Join the newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 2 }}>
              Subscribe for weekly updates. No spams ever! EVER EVER Just updates only
            </Typography>
            
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Your email address"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#252932',
                    '& fieldset': { borderColor: '#3a3f4b' },
                    '&:hover fieldset': { borderColor: '#4a5568' },
                  },
                  '& input': { color: '#fff' },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#3b82f6',
                  '&:hover': { backgroundColor: '#2563eb' },
                  flexShrink: 0,
                }}
              >
                Subscribe
              </Button>
            </Stack>
          </Box>

          {/* Right Section - Links */}
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 4, sm: 8 },
              flexWrap: 'wrap',
            }}
          >
            {/* Product Column */}
            <Box sx={{ minWidth: '120px' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                Product
              </Typography>
              <Stack spacing={1}>
                <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: '#fff' } }}
                onClick={() => setCurrentPage('features')}>
                  Features
                </Link>
                <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: '#fff' } }}
                 onClick={() => setCurrentPage('highlights')}>
                
                  Highlights
                </Link>
                <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: '#fff' } }}
                 onClick={() => setCurrentPage('about')}>
                  About
                </Link>
                <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: '#fff' } }}
                 onClick={() => setCurrentPage('blog')}>
                  Blog
                </Link>
              </Stack>
            </Box>

            {/* Company Column */}
            <Box sx={{ minWidth: '120px' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                Company
              </Typography>
              <Stack spacing={1}>
                <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: '#fff' } }}
                onClick={() => setCurrentPage('about')}>
                  About us
                </Link>
                <Link href="https://devanlee.me" target="_blank" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: '#fff' } }}
                 >
                  Developer
                </Link>
                <Link href="#" target="_blank" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: '#fff' } }}
                 >
                  Github
                </Link>
                <Link href="https://www.youtube.com/watch?v=xMHJGd3wwZk" target="_blank" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: '#fff' } }}
                >
                  DONT CLICK THIS LINK!
                </Link>
              </Stack>
            </Box>

            {/* Legal Column */}
            <Box sx={{ minWidth: '120px' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                Legal
              </Typography>
              <Stack spacing={1}>
                <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: '#fff' } }}
                onClick={() => setCurrentPage('terms')}>
                  Terms
                </Link>
                <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: '#fff' } }}
                onClick={() => setCurrentPage('privacy')}>
                  Privacy
                </Link>
                <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: '#fff' } }}
                onClick={() => setCurrentPage('contact')}>
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
            pt: 4,
            borderTop: '1px solid #3a3f4b',
            gap: 2,
          }}
        >
          {/* Left - Links & Copyright */}
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#fff' } }}
              onClick={() => setCurrentPage('privacy')}>
                Privacy Policy
              </Link>
              <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>•</Typography>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#fff' } }}
              onClick={() => setCurrentPage('tos')}>
                Terms of Service
              </Link>
            </Box>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Copyright © Devan Lee {new Date().getFullYear()}
            </Typography>
          </Box>

          {/* Right - Social Icons */}
          <Stack direction="row" spacing={1}>
            <IconButton
              href="https://github.com/mui"
              sx={{ color: '#9ca3af', '&:hover': { color: '#fff' } }}
              size="small"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              href="https://x.com/MaterialUI"
              sx={{ color: '#9ca3af', '&:hover': { color: '#fff' } }}
              size="small"
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              href="https://www.linkedin.com/company/mui/"
              sx={{ color: '#9ca3af', '&:hover': { color: '#fff' } }}
              size="small"
            >
              <LinkedInIcon />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}