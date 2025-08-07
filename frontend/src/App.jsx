// src/App.jsx

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, CssBaseline, ThemeProvider } from '@mui/material';
import HomePage from './components/HomePage';
import ListaJogos from './components/ListaJogos';
import CadastroJogo from './components/CadastroJogo';
import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 } } },
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [gameIdToEdit, setGameIdToEdit] = useState(null);

  const navigateTo = (page, payload = null) => {
    if (page === 'editarJogo') {
      setGameIdToEdit(payload); // Armazena o ID
      setCurrentPage('cadastroJogo'); // Navega para a página de cadastro/edição
    } else {
      setGameIdToEdit(null); // Limpa o ID ao navegar para outras páginas
      setCurrentPage(page);
    }
  }

   const renderPage = () => {
    switch (currentPage) {
      case 'listaJogos':
        return <ListaJogos onNavigate={navigateTo} />;
      case 'cadastroJogo':
        // MUDANÇA: Passamos o ID do jogo a ser editado como uma prop
        return <CadastroJogo onNavigate={navigateTo} gameIdToEdit={gameIdToEdit} />;
      case 'home':
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
        <CssBaseline />
        <AppBar position="static" elevation={1} color="default" sx={{ backgroundColor: 'background.paper' }}>
          <Toolbar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ flexGrow: 1, cursor: 'pointer' }}
              onClick={() => navigateTo('home')}
            >
              Meu Catálogo de Jogos
            </Typography>
          </Toolbar>
        </AppBar>
        {/* MUDANÇA AQUI: de 'lg' para 'xl' para acomodar a lista de jogos */}
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {renderPage()}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;