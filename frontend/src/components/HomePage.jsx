// src/components/HomePage.jsx

import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function HomePage({ onNavigate }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Bem-vindo ao seu Catálogo de Jogos
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mb: 5 }}>
        Organize, avalie e relembre suas maiores conquistas no mundo dos games.
      </Typography>
      
      <Stack direction="row" spacing={3}>
        <Button
          variant="contained"
          size="large"
          startIcon={<SportsEsportsIcon />}
          onClick={() => onNavigate('listaJogos')}
          sx={{ padding: '15px 30px', fontSize: '1.1rem' }}
        >
          Ver minha coleção
        </Button>
        <Button
          variant="outlined"
          size="large"
          color="secondary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => onNavigate('cadastroJogo')} // Navega para a nova página
          sx={{ padding: '15px 30px', fontSize: '1.1rem' }}
        >
          Cadastrar Novo Jogo
        </Button>
      </Stack>
    </Box>
  );
}

export default HomePage;