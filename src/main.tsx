import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@radix-ui/themes/styles.css";
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';
import './index.css'
import App from './App'
import { PageProvider } from './contexts/pageContexts';
import { AuthProvider } from './contexts/authContexts';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      dark: '#2563eb',
    },
    background: {
      default: '#0d1421',
      paper: '#151b2e',
    },
    text: {
      primary: '#e8eaed',
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
      <AuthProvider>
        <PageProvider>

          <App />
        </PageProvider>

      </AuthProvider>
     
         
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>,
)

