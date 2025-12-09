// src/components/HomePage.jsx

import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { motion } from 'framer-motion';

function HomePage({ onNavigate }) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%'
      }}
    >
      <Typography
        variant="h3"
        component={motion.h1}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        Bem-vindo ao seu Catálogo de Jogos
      </Typography>
      <Typography
        variant="h5"
        color="text.secondary"
        component={motion.p}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        sx={{ mb: 5 }}
      >
        Organize, avalie e relembre suas maiores conquistas no mundo dos games.
      </Typography>

      <Stack
        direction="row"
        spacing={3}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
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