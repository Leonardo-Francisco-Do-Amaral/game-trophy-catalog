import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Avatar, Rating, Tooltip, Paper, Card, CardContent, CardMedia, Grid, Chip, IconButton,
  LinearProgress, Divider, Button, ButtonGroup, TextField, InputAdornment, Menu, MenuItem, Fade,
  Stack, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, createTheme, ThemeProvider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { ptBR } from '@mui/x-data-grid/locales';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import BusinessIcon from '@mui/icons-material/Business';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
import SpeedIcon from '@mui/icons-material/Speed';

// ESTRUTURA CORRIGIDA: Tema definido globalmente no módulo
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f', // Vermelho forte
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffab00', // Âmbar/Amarelo
      light: '#ffc400',
      dark: '#ff8f00',
      contrastText: '#000000',
    },
    background: {
      default: '#000000ff', // Cinza bem claro para o fundo
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#616161',
    },
    error: {
      main: '#e53935', // Vermelho para erros e dificuldade impossível
    },
  },
 typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: { styleOverrides: { root: { borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 6, fontWeight: 500 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none', fontWeight: 500 } } },
  },
});

// ESTRUTURA CORRIGIDA: Funções auxiliares movidas para fora do componente para melhor organização
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('pt-BR');
};

const formatTotalTime = (hours, minutes) => {
  const h = hours || 0;
  const m = minutes || 0;
  if (h === 0 && m === 0) return 'N/A';

  let timeString = '';
  if (h > 0) timeString += `${h}h`;
  if (m > 0) timeString += ` ${m}m`;

  return timeString.trim();
};

const normPlatform = (p) => {
  if (["PS5", "PlayStation 5"].includes(p)) return "PS5";
  if (["PS4", "PlayStation 4"].includes(p)) return "PS4";
  return p;
};
const getPlatformChipStyle = (plataforma) => {
  const norm = normPlatform(plataforma);
  if (norm === "PS5") {
    return { backgroundColor: '#000000', color: 'white', fontWeight: 'bold' };
  }
  if (norm === "PS4") {
    return { backgroundColor: '#09294aff', color: 'white', fontWeight: 'bold' };
  }
  return { backgroundColor: '#f5f5f5', color: '#333' };
};

// Modal de detalhes reorganizado: imagem quadrada à esquerda, notas abaixo da imagem, dados principais ao lado, secundários abaixo, linha do tempo por último
const GameDetailsDialog = ({ game, open, onClose, onNavigate }) => {
  if (!game) return null;
  const totalPlayTime = formatTotalTime(game.tempo_jogado_horas, game.tempo_jogado_minutos);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth 
      PaperProps={{
        sx: {
          borderRadius: 5,
          // Efeito "glassmorphism" elegante com tons escuros
          background: 'rgba(28, 28, 30, 0.85)', // Fundo escuro semitransparente
          boxShadow: '0 8px 40px 0 rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)', // Efeito de vidro fosco
          border: '1.5px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff', // Cor do texto padrão para branco
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        fontWeight: 'bold', 
        fontSize: 24, 
        letterSpacing: 1, 
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        color: 'primary.contrastText' // Garante texto branco
      }}>
        {game.nome}
        <IconButton aria-label="close" onClick={onClose} sx={{ color: '#ffffff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, borderTop: 'none' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, p: 3, alignItems: { sm: 'flex-start', xs: 'center' } }}>
          {/* Imagem e Notas */}
          <Box sx={{
            width: 140,
            minWidth: 140,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{
              width: 140,
              height: 140,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 0 0 4px #1c1c1e, 0 4px 24px rgba(0,0,0,0.3)', // Sombra ajustada para o fundo escuro
              border: `3px solid ${customTheme.palette.secondary.main}` // Destaque dourado
            }}>
              <img
                src={game.foto_url || `https://placehold.co/140x140/d32f2f/fff?text=${encodeURIComponent(game.nome?.substring(0, 2).toUpperCase() || '??')}`}
                alt={game.nome}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography variant="caption" sx={{ color: '#a0a0a0', fontWeight: 'bold', display: 'block', textAlign: 'center', mb: 1, textTransform: 'uppercase' }}>Notas</Typography>
              <Stack spacing={0.5} sx={{ width: '100%' }}>
                <Tooltip title={`Gameplay: ${game.nota_gameplay ?? '-'}/10`} placement="left">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <SportsEsportsIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                    <Rating value={(game.nota_gameplay || 0) / 2} readOnly precision={0.5} size="small" />
                  </Box>
                </Tooltip>
                <Tooltip title={`História: ${game.nota_historia ?? '-'}/10`} placement="left">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AutoStoriesIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                    <Rating value={(game.nota_historia || 0) / 2} readOnly precision={0.5} size="small" />
                  </Box>
                </Tooltip>
                <Tooltip title={`Trilha Sonora: ${game.nota_trilha_sonora ?? '-'}/10`} placement="left">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <MusicNoteIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                    <Rating value={(game.nota_trilha_sonora || 0) / 2} readOnly precision={0.5} size="small" />
                  </Box>
                </Tooltip>
              </Stack>
            </Box>
          </Box>
          {/* Dados Principais e Secundários */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              <Chip icon={<SpeedIcon sx={{color: '#fff !important'}}/>} label={game.dificuldade_platina || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
              <Chip icon={<CalendarTodayIcon sx={{color: '#fff !important'}}/>} label={game.ano_lancamento || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
              <Chip icon={<BusinessIcon sx={{color: '#fff !important'}}/>} label={game.desenvolvedora || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
              <Chip icon={<StorefrontIcon sx={{color: '#fff !important'}}/>} label={game.publicadora || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
            </Box>
            <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.15)' }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              <Chip icon={<CategoryIcon sx={{color: '#fff !important'}}/>} label={game.genero || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
              <Chip icon={<MusicNoteIcon sx={{color: '#fff !important'}}/>} label={game.idioma || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
              <Chip icon={<AccessTimeIcon sx={{color: '#fff !important'}}/>} label={totalPlayTime} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
              <Chip icon={<MilitaryTechIcon sx={{color: '#fff !important'}}/>} label={game.status_online || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
              <Chip icon={<CheckCircleIcon sx={{color: '#fff !important'}}/>} label={game.completude_jogo || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
              <Chip icon={<EmojiEventsIcon sx={{color: '#fff !important'}}/>} label={`Progresso: ${game.trofeus_obtidos || 0}/${game.trofeus_totais || 0}`} sx={{ background: 'rgba(255, 171, 0, 0.2)', color: '#ffab00', fontWeight: 'bold' }} />
            </Box>
            <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.15)' }} />
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1.5, color: 'secondary.main' }}>Linha do Tempo dos Troféus</Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{color: '#e0e0e0'}}><b>Primeiro Troféu:</b> {formatDate(game.data_primeiro_trofeu)}</Typography>
                <Typography variant="body2" sx={{color: '#e0e0e0'}}><b>Último Troféu:</b> {formatDate(game.data_ultimo_trofeu)}</Typography>
                <Typography variant="body2" sx={{color: '#e0e0e0'}}><b>Dias para Platina:</b> {game.dias_para_platina ? `${game.dias_para_platina} dias` : '-'}</Typography>
              </Stack>
            </Box>
          </Box>
        </Box>
      </DialogContent>
         <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', p: 1.5, justifyContent: 'space-between' }}>
        {/* NOVO: Botão de Editar */}
        <Button
          onClick={() => {
            if (onNavigate) {
              onNavigate('editarJogo', game.id);
            }
            onClose(); // Fecha o modal após clicar em editar
          }}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 'bold' }}
        >
          Editar Jogo
        </Button>
        <Button onClick={onClose} color="secondary" sx={{ fontWeight: 'bold' }}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

const GameCard = ({ game, onClick }) => {
  const isCompleted = game.isCompleted;
  const genres = game.genero ? game.genero.split(' - ') : [];
  const totalPlayTime = formatTotalTime(game.tempo_jogado_horas, game.tempo_jogado_minutos);
  
  const isImpossible = typeof game.dificuldade_platina === 'string' &&
    game.dificuldade_platina
      .normalize('NFD')
      .replace(/[ - ]/g, '')
      .replace(/\u0300-\u036f/g, '')
      .toLowerCase()
      .trim() === 'impossivel';

  const midia = (game.tipo_jogo || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const isFisico = midia === 'fisica';

  const baseCardStyle = {
    background: 'linear-gradient(145deg, #2a2d34 0%, #1c1e22 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  };

  const fisicoBoxStyle = isFisico ? {
    border: '2px solid #1565c0',
    boxShadow: '0 0 12px -2px #1565c0, 0 0 6px -3px #1565c0c0', 
    background: '#1f232b',
    position: 'relative',
    overflow: 'hidden',
  } : {};

  let fisicoLogo = null;
  const plataformaNorm = normPlatform(game.plataforma);
  if (isFisico && plataformaNorm === 'PS5') {
    fisicoLogo = (
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 38, background: '#111', borderTopLeftRadius: '15px', borderTopRightRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
        <Box component="img" src="/PS5-card.png" alt="PS5" sx={{ height: 32, objectFit: 'contain' }} />
      </Box>
    );
  } else if (isFisico && plataformaNorm === 'PS4') {
    fisicoLogo = (
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 38, background: '#fff', borderTopLeftRadius: '15px', borderTopRightRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
        <Box component="img" src="/PS4-card.png" alt="PS4" sx={{ height: 32, objectFit: 'contain' }} />
      </Box>
    );
  }
  const platformLabel = !isFisico && (['PS5', 'PS4'].includes(plataformaNorm)) ? {
    label: plataformaNorm,
    sx: {
      position: 'absolute',
      top: 12,
      left: 12,
      zIndex: 4,
      background: plataformaNorm === 'PS5' ? '#fff' : '#09294a',
      color: plataformaNorm === 'PS5' ? '#222' : '#fff',
      fontWeight: 'bold',
      border: `2px solid ${plataformaNorm === 'PS5' ? '#000' : '#09294a'}`,
      borderRadius: '8px',
      px: 1.5,
      py: 0.5,
      fontSize: 14,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }
  } : null;

  return (
    <Card
      onClick={onClick}
      sx={{
        ...baseCardStyle,
        width: '100%',
        minWidth: 280,
        maxWidth: 320,
        minHeight: 480,
        maxHeight: 520,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.3s cubic-bezier(.4,2,.3,1)',
        cursor: 'pointer',
        border: isImpossible ? `2px solid ${customTheme.palette.error.main}` :
                isCompleted ? `2px solid ${customTheme.palette.secondary.main}` :
                '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '18px',
        alignSelf: 'stretch',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.03)',
          boxShadow: isFisico
            ? '0 0 24px -4px #1565c0, 0 0 12px -2px #1565c0c0'
            : isCompleted
            ? `0 0 24px -4px ${customTheme.palette.secondary.dark}`
            : '0 8px 32px rgba(0,0,0,0.5)',
          '& .game-cover': { transform: 'scale(1.08)' }
        },
        ...fisicoBoxStyle
      }}
    >
      {fisicoLogo}
      {platformLabel && (
        <Box sx={platformLabel.sx}>{platformLabel.label}</Box>
      )}
      
      {isImpossible && (
        <Box component="img" src="/efeito-vidro.png" alt="Efeito de vidro quebrado" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', zIndex: 3, opacity: 0.6 }} />
      )}

      <Box sx={{ position: 'relative', overflow: 'hidden', height: isFisico ? 180 : 160, borderTopLeftRadius: isFisico ? 0 : 18, borderTopRightRadius: isFisico ? 0 : 18, mt: isFisico ? '38px' : 0 }}>
        <CardMedia
          component="img"
          height={isFisico ? 180 : 160}
          image={game.foto_url || `https://placehold.co/340x160/d32f2f/fff?text=${encodeURIComponent(game.nome?.substring(0, 2).toUpperCase() || '??')}`}
          alt={game.nome}
          className="game-cover"
          sx={{ transition: 'transform 0.3s cubic-bezier(.4,2,.3,1)', objectFit: 'cover', filter: 'brightness(0.97)', borderTopLeftRadius: isFisico ? 0 : 18, borderTopRightRadius: isFisico ? 0 : 18, width: '100%', height: '100%', display: 'block' }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 1, // Aumentado o espaço entre os itens
            flexDirection: 'column',
            alignItems: 'flex-end',
            zIndex: 2
          }}>
          {game.colocacao && (
            <Chip
              label={`#${game.colocacao}`}
              size="small"
              color="primary"
              sx={{
                fontWeight: 'bold',
                height: '24px',
                background: 'rgba(255,255,255,0.85)',
                color: '#d32f2f',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                '& .MuiChip-label': { px: 1 }
              }}
            />
          )}

          {/* A MUDANÇA ESTÁ AQUI: trocamos o Chip pela imagem do troféu */}
          {game.platinado && (
            <Tooltip title="Platinado">
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  background: 'radial-gradient(circle, rgba(40,40,40,0.8) 0%, rgba(20,20,20,0.9) 100%)',
                  borderRadius: '50%',
                  border: '2px solid #FFD700',
                  boxShadow: '0 2px 8px #FFD70044, 0 1px 4px #00000088',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 0,
                }}
              >
                <Box
                  component="img"
                  src="/trofeu.png" // Utiliza a imagem da pasta /public
                  alt="Troféu Platinado"
                  sx={{
                    width: 32,
                    height: 32,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 1px 2px #FFD70088)',
                    opacity: 0.95,
                  }}
                />
              </Box>
            </Tooltip>
          )}
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: 220, height: '100%', boxSizing: 'border-box', overflow: 'hidden', zIndex: 2 }}>
        <Typography variant="h6" component="h3" align="center" sx={{ fontWeight: 'bold', fontSize: '1.08rem', lineHeight: 1.2, height: '2.4rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', mb: 1, 
          color: isImpossible ? 'error.main' : '#ffffff', 
          letterSpacing: 0.5 
        }}>
          {game.nome}
        </Typography>
        {(typeof game.nota_gameplay === 'number' || typeof game.nota_historia === 'number' || typeof game.nota_trilha_sonora === 'number') && (() => {
          const notas = [game.nota_gameplay, game.nota_historia, game.nota_trilha_sonora].filter(n => typeof n === 'number');
          const media = notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : 0;
          const estrelas = +(media).toFixed(2); // 10 estrelas
          const isMaxima = media === 10;
          return (
            <Tooltip title={`Nota média: ${media > 0 ? media.toFixed(1) : '-'}/10`} placement="top">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, justifyContent: 'center', cursor: 'pointer' }}>
                <Rating
                  value={estrelas}
                  max={10}
                  readOnly
                  precision={0.1}
                  size="small"
                  sx={{
                    '& .MuiRating-icon': {
                      fontSize: '1.2rem',
                      color: isImpossible ? 'error.main' : isMaxima ? '#FFD700' : 'secondary.main',
                      filter: isMaxima ? 'drop-shadow(0 0 6px #FFD700)' : undefined,
                      transition: 'filter 0.3s',
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: isMaxima ? '#FFD700' : '#fff', fontWeight: isMaxima ? 'bold' : 500, mt: 0.5, textShadow: isMaxima ? '0 0 8px #FFD700' : undefined }}>
                  {isMaxima ? 'Nota Máxima!' : `${media.toFixed(1)}/10`}
                </Typography>
              </Box>
            </Tooltip>
          );
        })()}
        <Box sx={{ minHeight: 99, maxHeight: 72, overflowY: 'auto', my: 1, pr: '4px', '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { background: '#444', borderRadius: '2px' } }}>
          <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1} sx={{ width: '100%', alignItems: 'flex-start', rowGap: 1, columnGap: 1, overflow: 'visible', justifyContent: 'flex-start' }}>
            <Chip icon={<SpeedIcon sx={{color: isImpossible ? 'inherit' : '#e0e0e0 !important'}}/>} label={game.dificuldade_platina} size="small" variant="filled" color={isImpossible ? 'error' : 'default'} sx={{ background: isImpossible ? undefined : 'rgba(255,255,255,0.08)', color: '#e0e0e0', fontWeight: isImpossible ? 'bold' : 'normal' }} />
            {game.tipo_jogo && <Chip icon={<CategoryIcon sx={{color: '#e0e0e0 !important'}}/>} label={game.tipo_jogo} size="small" sx={{ background: 'rgba(255,255,255,0.08)', color: '#e0e0e0' }} />}
            {game.ano_lancamento && <Chip icon={<CalendarTodayIcon sx={{color: '#e0e0e0 !important'}}/>} label={game.ano_lancamento} size="small" sx={{ background: 'rgba(255,255,255,0.08)', color: '#e0e0e0' }} />}
            {genres.map((genre, index) => (<Chip key={index} label={genre} size="small" sx={{ background: 'rgba(255,255,255,0.08)', color: '#e0e0e0' }} />))}
          </Stack>
        </Box>
        <Box sx={{ mt: 'auto', width: '100%' }}>
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" color="#a0a0a0" sx={{ fontSize: '0.75rem' }}>Progresso</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#fff' }}>{game.trofeus_obtidos || 0}/{game.trofeus_totais || 0}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={game.progresso || 0} color={game.platinado ? 'secondary' : isImpossible ? 'error' : 'primary'} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          </Box>
          <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%', alignItems: 'stretch', pb: 0.5, color: '#bdbdbd' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: '0.9rem' }} />
                <Typography variant="body2" sx={{ fontSize: 'inherit' }}>{totalPlayTime || 'N/A'}</Typography>
              </Box>
              {game.dias_para_platina && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: '0.9rem' }} />
                  <Typography variant="body2" sx={{ fontSize: 'inherit' }}>{game.dias_para_platina}d</Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 1, mt: 0.5, px: 0.5 }}>
              <Tooltip title={`Desenvolvedora: ${game.desenvolvedora || 'N/A'}`}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0, flex: 1, overflow: 'hidden' }}>
                  <BusinessIcon sx={{ fontSize: '0.9rem', flexShrink: 0 }} />
                  <Typography variant="body2" noWrap sx={{ fontSize: 'inherit', maxWidth: '100%' }}>{game.desenvolvedora || 'N/A'}</Typography>
                </Box>
              </Tooltip>
              <Tooltip title={`Publicadora: ${game.publicadora || 'N/A'}`}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0, flex: 1, overflow: 'hidden' }}>
                  <StorefrontIcon sx={{ fontSize: '0.9rem', flexShrink: 0 }} />
                  <Typography variant="body2" noWrap sx={{ fontSize: 'inherit', maxWidth: '100%' }}>{game.publicadora || 'N/A'}</Typography>
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function ListaJogos({ onNavigate }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('colocacao');
  const [selectedGameDetails, setSelectedGameDetails] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/jogos');
        if (!response.ok) throw new Error(`Erro na API! Status: ${response.status}`);
        const data = await response.json();
        const processedData = data.map(game => ({
          ...game,
          id: game.id.toString(),
          data_primeiro_trofeu: game.data_primeiro_trofeu ? new Date(game.data_primeiro_trofeu) : null,
          data_ultimo_trofeu: game.data_ultimo_trofeu ? new Date(game.data_ultimo_trofeu) : null,
          progresso: game.trofeus_totais ? ((game.trofeus_obtidos || 0) / game.trofeus_totais) * 100 : 0,
          isCompleted: game.trofeus_totais && game.trofeus_obtidos && game.trofeus_totais === game.trofeus_obtidos,
        }));
        setGames(processedData);
      } catch (err) {
        console.error("Falha ao buscar jogos:", err);
        setError("Não foi possível carregar os jogos. Verifique se o servidor está rodando.");
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const handleFilterMenuOpen = (event) => setFilterAnchorEl(event.currentTarget);
  const handleFilterMenuClose = () => setFilterAnchorEl(null);
  const handleSortMenuOpen = (event) => setSortAnchorEl(event.currentTarget);
  const handleSortMenuClose = () => setSortAnchorEl(null);
  const handleFilterSelect = (filter) => { setSelectedFilter(filter); handleFilterMenuClose(); };
  const handleSortSelect = (sort) => { setSortBy(sort); handleSortMenuClose(); };
  const handleOpenDetails = (game) => { setSelectedGameDetails(game); };
  const handleCloseDetails = () => { setSelectedGameDetails(null); };

  const filteredGames = games.filter(game => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = game.nome?.toLowerCase().includes(searchTermLower) ||
      game.desenvolvedora?.toLowerCase().includes(searchTermLower) ||
      game.publicadora?.toLowerCase().includes(searchTermLower) ||
      game.genero?.toLowerCase().includes(searchTermLower);
      
    const matchesFilter = selectedFilter === 'all' ||
      (selectedFilter === 'platinado' && game.platinado) ||
      (selectedFilter === 'nao_platinado' && !game.platinado) ||
      (selectedFilter === 'em_progresso' && game.progresso > 0 && !game.platinado);
      
    return matchesSearch && matchesFilter;
  });
  
  const sortedGames = [...filteredGames].sort((a, b) => {
    // Calcula a nota média para ordenação
    const getMedia = (game) => {
      const notas = [game.nota_gameplay, game.nota_historia, game.nota_trilha_sonora].filter(n => typeof n === 'number');
      return notas.length ? notas.reduce((acc, val) => acc + val, 0) / notas.length : 0;
    };
    const notaA = getMedia(a);
    const notaB = getMedia(b);

    switch (sortBy) {
      case 'colocacao': return (a.colocacao || 9999) - (b.colocacao || 9999);
      case 'nome': return (a.nome || '').localeCompare(b.nome || '');
      case 'nota_total': return notaB - notaA;
      case 'progresso': return (b.progresso || 0) - (a.progresso || 0);
      case 'tempo_jogado': 
        const tempoA = (a.tempo_jogado_horas || 0) * 60 + (a.tempo_jogado_minutos || 0);
        const tempoB = (b.tempo_jogado_horas || 0) * 60 + (b.tempo_jogado_minutos || 0);
        return tempoB - tempoA;
      default: return 0;
    }
  });

  const TrophyCard = () => {
    if (games.length === 0) return null;

    const platinados = games.filter(g => g.platinado).length;
    const emProgresso = games.filter(g => g.progresso > 0 && !g.platinado).length;
    const trofeusObtidos = games.reduce((acc, g) => acc + (g.trofeus_obtidos || 0), 0);
    const totalTrofeus = games.reduce((acc, g) => acc + (g.trofeus_totais || 0), 0);
    const tempoTotal = games.reduce((acc, g) => acc + (g.tempo_jogado_horas || 0), 0);
    const jogosComPlatina = games.filter(g => g.dias_para_platina > 0);
    const mediaDias = jogosComPlatina.length ? jogosComPlatina.reduce((acc, g) => acc + g.dias_para_platina, 0) / jogosComPlatina.length : 0;
    const percentualGeral = totalTrofeus ? (trofeusObtidos / totalTrofeus) * 100 : 0;
    const totalJogos = games.length;
    const percentualPlatinados = totalJogos ? (platinados / totalJogos) * 100 : 0;

    return (
      <Card
        sx={{
          background: 'linear-gradient(135deg, #181c24 0%, #23272f 100%)',
          color: '#fff',
          mb: 3,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 5,
          boxShadow: '0 8px 40px 0 rgba(0,0,0,0.45)',
          border: '1.5px solid #23272f',
        }}
      >
        {/* Efeito glassmorphism */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: 'rgba(24,28,36,0.85)',
            backdropFilter: 'blur(8px)',
          }}
        />
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmojiEventsIcon sx={{ fontSize: '2.8rem', mr: 2, color: '#FFD700', filter: 'drop-shadow(0 2px 8px #FFD70055)' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: 1, color: '#fff', textShadow: '0 2px 8px #0008' }}>
                Central de Troféus
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.7, color: '#eee' }}>
                Acompanhe seu progresso geral
              </Typography>
            </Box>
          </Box>
          {/* Linha de resumo geral */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(40,44,56,0.85)',
            borderRadius: 3,
            px: 3,
            py: 2,
            mb: 3,
            boxShadow: '0 2px 12px #0004',
            border: '1.5px solid #23272f',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VideogameAssetIcon sx={{ color: '#90caf9', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>Total de Jogos:</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#FFD700', ml: 1 }}>{totalJogos}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmojiEventsIcon sx={{ color: '#FFD700', fontSize: 26 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>Platinados:</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#FFD700', ml: 1 }}>{platinados}</Typography>
              <Typography variant="body2" sx={{ color: '#aaa', ml: 1 }}>({percentualPlatinados.toFixed(1)}%)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MilitaryTechIcon sx={{ color: '#4caf50', fontSize: 26 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>Em Progresso:</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#4caf50', ml: 1 }}>{emProgresso}</Typography>
            </Box>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2.5,
                  background: 'rgba(30,32,40,0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1.5px solid #23272f',
                  borderRadius: 3,
                  boxShadow: '0 2px 12px #0006',
                  color: '#fff',
                }}
                elevation={0}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                  <EmojiEventsIcon sx={{ color: '#FFD700', fontSize: 28, mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFD700', letterSpacing: 0.5, mr: 2 }}>
                    Progresso Geral
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#4caf50', fontSize: '2.2rem', ml: 'auto', minWidth: 90, textAlign: 'right', textShadow: '0 2px 8px #4caf5044' }}>
                    {percentualGeral.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentualGeral}
                  sx={{
                    height: 14,
                    borderRadius: 7,
                    background: 'rgba(255,255,255,0.08)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 7,
                      background: 'linear-gradient(90deg, #FFD700 0%, #23272f 100%)',
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600 }}>{trofeusObtidos} obtidos</Typography>
                  <Typography variant="body2" sx={{ color: '#aaa', fontWeight: 500 }}>{totalTrofeus} total</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper
                    sx={{
                      p: 3,
                      minHeight: 140,
                      background: 'rgba(30,32,40,0.85)',
                      backdropFilter: 'blur(10px)',
                      border: '1.5px solid #23272f',
                      borderRadius: 3,
                      textAlign: 'center',
                      color: '#fff',
                      boxShadow: '0 2px 12px #0006',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    elevation={0}
                  >
                    <CancelIcon sx={{ color: '#bdbdbd', fontSize: 36, mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#FFD700', textShadow: '0 2px 8px #FFD70055' }}>
                      {totalTrofeus - trofeusObtidos}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#aaa', fontWeight: 500 }}>Restantes</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper
                    sx={{
                      p: 3,
                      minHeight: 140,
                      background: 'rgba(30,32,40,0.85)',
                      backdropFilter: 'blur(10px)',
                      border: '1.5px solid #23272f',
                      borderRadius: 3,
                      textAlign: 'center',
                      color: '#fff',
                      boxShadow: '0 2px 12px #0006',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    elevation={0}
                  >
                    <CalendarTodayIcon sx={{ color: '#90caf9', fontSize: 36, mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#4caf50', textShadow: '0 2px 8px #4caf5055' }}>
                      {mediaDias.toFixed(0)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#aaa', fontWeight: 500 }}>Dias Média</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{
                    textAlign: 'center',
                    p: 3,
                    minHeight: 170,
                    background: 'rgba(30,32,40,0.85)',
                    borderRadius: 3,
                    border: '1.5px solid #23272f',
                    color: '#FFD700',
                    fontWeight: 900,
                    boxShadow: '0 2px 12px #0006',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                  }}>
                    <EmojiEventsIcon sx={{ color: '#FFD700', fontSize: 36, mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#FFD700', textShadow: '0 2px 8px #FFD70055' }}>{platinados}</Typography>
                    <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>Jogos Platinados</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{
                    textAlign: 'center',
                    p: 3,
                    minHeight: 170,
                    background: 'rgba(30,32,40,0.85)',
                    borderRadius: 3,
                    border: '1.5px solid #23272f',
                    color: '#4caf50',
                    fontWeight: 900,
                    boxShadow: '0 2px 12px #0006',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                  }}>
                    <MilitaryTechIcon sx={{ color: '#4caf50', fontSize: 36, mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#4caf50', textShadow: '0 2px 8px #4caf5055' }}>{emProgresso}</Typography>
                    <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>Em Progresso</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{
                    textAlign: 'center',
                    p: 3,
                    minHeight: 170,
                    background: 'rgba(30,32,40,0.85)',
                    borderRadius: 3,
                    border: '1.5px solid #23272f',
                    color: '#fff',
                    fontWeight: 900,
                    boxShadow: '0 2px 12px #0006',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                  }}>
                    <AccessTimeIcon sx={{ color: '#90caf9', fontSize: 36, mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', textShadow: '0 2px 8px #FFD70033' }}>{tempoTotal}h</Typography>
                    <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>Tempo Total</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const columns = [
    { field: 'colocacao', headerName: '#', width: 60, align: 'center', headerAlign: 'center', renderCell: (params) => <Typography sx={{ fontWeight: 'bold' }}>#{params.value}</Typography> },
    { field: 'nome', headerName: 'Nome do Jogo', flex: 2, minWidth: 250, renderCell: (params) => (<Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}><Avatar src={params.row.foto_url} sx={{ mr: 2, width: 40, height: 40 }} variant="rounded" /><Typography variant="body2" sx={{ fontWeight: 500 }}>{params.value}</Typography></Box>) },
    { field: 'progresso', headerName: 'Progresso', flex: 1.5, minWidth: 150, renderCell: (params) => (<Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}><Box sx={{ width: '100%', mr: 1 }}><LinearProgress variant="determinate" value={params.value} sx={{ height: 6, borderRadius: 3 }} color={params.row.platinado ? 'secondary' : 'primary'} /></Box><Typography variant="body2" color="text.secondary">{`${Math.round(params.value || 0)}%`}</Typography></Box>) },
    { field: 'nota_total', headerName: 'Nota', width: 130, renderCell: (params) => {
      const notas = [params.row.nota_gameplay, params.row.nota_historia, params.row.nota_trilha_sonora].filter(n => typeof n === 'number');
      const media = notas.length ? notas.reduce((a,b) => a + b, 0) / notas.length : 0;
      return (<Box sx={{ display: 'flex', alignItems: 'center' }}><Rating value={media/2} readOnly size="small" precision={0.5} /><Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>({media > 0 ? media.toFixed(1) : 'N/A'})</Typography></Box>);
    }},
    { field: 'plataforma', headerName: 'Plataforma', width: 100, renderCell: (params) => <Chip label={normPlatform(params.value)} size="small" sx={getPlatformChipStyle(params.value)} /> },
    { field: 'platinado', headerName: 'Platinado', width: 100, align: 'center', headerAlign: 'center', renderCell: (params) => (params.value ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />) },
    { field: 'tempo_jogado_horas', headerName: 'Tempo (h)', width: 100, align: 'center', headerAlign: 'center', valueGetter: (value, row) => formatTotalTime(row.tempo_jogado_horas, row.tempo_jogado_minutos) },
  ];

  if (loading) {
    return (
      <ThemeProvider theme={customTheme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress size={60} />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={customTheme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <VideogameAssetIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography color="error" variant="h6">{error}</Typography>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ 
          backgroundColor: 'background.default', 
          minHeight: '100vh',
          maxWidth: '1800px',
          mx: 'auto',
          p: { xs: 1, sm: 2, md: 3 }
        }}>
        <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterMenuClose} TransitionComponent={Fade}>
          <MenuItem onClick={() => handleFilterSelect('all')} selected={selectedFilter === 'all'}>Todos</MenuItem>
          <MenuItem onClick={() => handleFilterSelect('platinado')} selected={selectedFilter === 'platinado'}>Platinados</MenuItem>
          <MenuItem onClick={() => handleFilterSelect('nao_platinado')} selected={selectedFilter === 'nao_platinado'}>Não Platinados</MenuItem>
          <MenuItem onClick={() => handleFilterSelect('em_progresso')} selected={selectedFilter === 'em_progresso'}>Em Progresso</MenuItem>
        </Menu>
        <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={handleSortMenuClose} TransitionComponent={Fade}>
          <MenuItem onClick={() => handleSortSelect('colocacao')} selected={sortBy === 'colocacao'}>Colocação</MenuItem>
          <MenuItem onClick={() => handleSortSelect('nome')} selected={sortBy === 'nome'}>Nome</MenuItem>
          <MenuItem onClick={() => handleSortSelect('nota_total')} selected={sortBy === 'nota_total'}>Nota</MenuItem>
          <MenuItem onClick={() => handleSortSelect('progresso')} selected={sortBy === 'progresso'}>Progresso</MenuItem>
          <MenuItem onClick={() => handleSortSelect('tempo_jogado')} selected={sortBy === 'tempo_jogado'}>Tempo Jogado</MenuItem>
        </Menu>
        <Paper sx={{ p: 2, mb: 3, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>Minha Coleção de Jogos</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <TextField variant="outlined" size="small" placeholder="Buscar jogo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, '& fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&:hover fieldset': { borderColor: 'white' }, '&.Mui-focused fieldset': { borderColor: 'white' }, }, '& .MuiInputBase-input': { color: 'white' }, '& .MuiSvgIcon-root': { color: 'white' }, }} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }} />
              <Tooltip title="Filtrar"><IconButton onClick={handleFilterMenuOpen} sx={{ color: 'white' }}><FilterListIcon /></IconButton></Tooltip>
              <Tooltip title="Ordenar"><IconButton onClick={handleSortMenuOpen} sx={{ color: 'white' }}><SortIcon /></IconButton></Tooltip>
              <ButtonGroup variant="contained" size="small" sx={{ boxShadow: 'none' }}><Button onClick={() => setViewMode('grid')} disabled={viewMode === 'grid'}><ViewModuleIcon /></Button><Button onClick={() => setViewMode('list')} disabled={viewMode === 'list'}><ViewListIcon /></Button></ButtonGroup>
            </Box>
          </Box>
        </Paper>
        <TrophyCard />
        {viewMode === 'grid' ? (
          <Grid
            container
            spacing={3}
            sx={{
              justifyContent: 'center', 
              alignItems: 'stretch',
            }}>
            {sortedGames.map((game) => (
              <Grid
                item
                key={game.id}
                xs={12} sm={6} md={4} lg={3} xl={2.4} 
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <GameCard game={game} onClick={() => handleOpenDetails(game)} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ height: 'auto', width: '100%', mt: 3, borderRadius: 3, overflow: 'hidden' }}>
            <DataGrid
              rows={sortedGames}
              columns={columns}
              onRowClick={(params) => handleOpenDetails(params.row)}
              rowHeight={64}
              pageSize={sortedGames.length}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              autoHeight
              sx={{ 
                border: 'none', 
                '& .MuiDataGrid-row': { cursor: 'pointer' },
                '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none !important' } 
              }}
            />
          </Paper>
        )}
        <GameDetailsDialog 
            game={selectedGameDetails} 
            open={Boolean(selectedGameDetails)} 
            onClose={handleCloseDetails}
            onNavigate={onNavigate} 
        />
      </Box>
    </ThemeProvider>
  );
}

export default ListaJogos;