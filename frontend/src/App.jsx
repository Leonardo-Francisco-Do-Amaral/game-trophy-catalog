import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import HomePage from './components/HomePage';
import ListaJogos from './components/ListaJogos';
import CadastroJogo from './components/CadastroJogo';
import theme from './theme/theme';

function AppContent() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      <AppBar position="static" elevation={1} color="default" sx={{ backgroundColor: 'background.paper' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 'bold', letterSpacing: 0.5 }}
            onClick={() => navigate('/')}
          >
            Meu Catálogo de Jogos
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage onNavigate={(page) => navigate(page === 'listaJogos' ? '/jogos' : '/cadastro')} />} />
          <Route path="/jogos" element={<ListaJogos onNavigate={(page, id) => navigate(page === 'editarJogo' ? `/editar/${id}` : '/')} />} />
          <Route path="/cadastro" element={<CadastroJogo onNavigate={(page) => navigate(page === 'listaJogos' ? '/jogos' : '/')} />} />
          <Route path="/editar/:id" element={<CadastroJogoWrapper />} />
        </Routes>
      </Container>
    </Box>
  );
}

// Wrapper to handle params for edit mode
import { useParams } from 'react-router-dom';
function CadastroJogoWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <CadastroJogo onNavigate={(page) => navigate(page === 'listaJogos' ? '/jogos' : '/')} gameIdToEdit={id} />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Router>
          <AppContent />
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;