import { createTheme } from '@mui/material/styles';
import { deepPurple, grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: deepPurple[400],
      light: deepPurple[200],
      dark: deepPurple[700],
      contrastText: '#fff',
    },
    secondary: {
      main: '#82b1ff',
      light: '#b7e3ff',
      dark: '#4c82cc',
      contrastText: '#000',
    },
    background: {
      default: grey[900],
      paper: grey[800],
    },
    text: {
      primary: '#fff',
      secondary: grey[400],
    },
    error: {
      main: '#e53935',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700, color: deepPurple[200] },
    h5: { fontWeight: 600, color: deepPurple[100] },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: grey[900],
          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.4)',
          backgroundColor: grey[800],
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.6)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '2rem',
          paddingBottom: '2rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500
        }
      }
    }
  },
});

export default theme;