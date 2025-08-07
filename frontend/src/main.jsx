import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from '@mui/material/styles'; // Importa o ThemeProvider
import theme from './theme/theme.js'; // Importa o seu tema

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}> {/* Envolve o App com o ThemeProvider */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);