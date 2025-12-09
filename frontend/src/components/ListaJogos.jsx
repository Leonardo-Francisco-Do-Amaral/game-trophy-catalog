import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Avatar, Rating, Tooltip, Paper, Grid, Chip, IconButton,
  LinearProgress, Button, ButtonGroup, TextField, InputAdornment, Menu, MenuItem, Fade,
  CircularProgress, ThemeProvider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { ptBR } from '@mui/x-data-grid/locales';
import { motion, AnimatePresence } from 'framer-motion';

import theme from '../theme/theme';
import { api } from '../services/api';
import { formatTotalTime, normPlatform, getPlatformChipStyle } from '../utils/formatters';
import GameCard from './game/GameCard';
import SkeletonGameCard from './game/SkeletonGameCard';
import GameDetailsDialog from './game/GameDetailsDialog';
import TrophyCard from './game/TrophyCard';

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
        const data = await api.getGames();
        const processedData = data.map(game => ({
          ...game,
          id: game.id.toString(),
          data_primeiro_trofeu: game.data_primeiro_trofeu ? new Date(game.data_primeiro_trofeu) : null,
          data_ultimo_trofeu: game.data_ultimo_trofeu ? new Date(game.data_ultimo_trofeu) : null,
          progresso: game.trofeus_totais ? ((game.trofeus_obtidos || 0) / game.trofeus_totais) * 100 : 0,
          isCompleted: game.trofeus_totais && game.trofeus_obtidos && game.trofeus_totais === game.trofeus_obtidos,
          nota_gameplay: game.nota_gameplay ? parseFloat(game.nota_gameplay) : null,
          nota_historia: game.nota_historia ? parseFloat(game.nota_historia) : null,
          nota_trilha_sonora: game.nota_trilha_sonora ? parseFloat(game.nota_trilha_sonora) : null,
          nota_total: game.nota_total ? parseFloat(game.nota_total) : null,
          metacritic: game.metacritic,
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

  const columns = [
    { field: 'colocacao', headerName: '#', width: 60, align: 'center', headerAlign: 'center', renderCell: (params) => <Typography sx={{ fontWeight: 'bold' }}>#{params.value}</Typography> },
    { field: 'nome', headerName: 'Nome do Jogo', flex: 2, minWidth: 250, renderCell: (params) => (<Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}><Avatar src={params.row.foto_url} sx={{ mr: 2, width: 40, height: 40 }} variant="rounded" /><Typography variant="body2" sx={{ fontWeight: 500 }}>{params.value}</Typography></Box>) },
    { field: 'progresso', headerName: 'Progresso', flex: 1.5, minWidth: 150, renderCell: (params) => (<Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}><Box sx={{ width: '100%', mr: 1 }}><LinearProgress variant="determinate" value={params.value} sx={{ height: 6, borderRadius: 3 }} color={params.row.platinado ? 'secondary' : 'primary'} /></Box><Typography variant="body2" color="text.secondary">{`${Math.round(params.value || 0)}%`}</Typography></Box>) },
    {
      field: 'nota_total', headerName: 'Nota', width: 130, renderCell: (params) => {
        const notas = [params.row.nota_gameplay, params.row.nota_historia, params.row.nota_trilha_sonora].filter(n => typeof n === 'number');
        const media = notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : 0;
        return (<Box sx={{ display: 'flex', alignItems: 'center' }}><Rating value={media / 2} readOnly size="small" precision={0.5} /><Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>({media > 0 ? media.toFixed(1) : 'N/A'})</Typography></Box>);
      }
    },
    { field: 'plataforma', headerName: 'Plataforma', width: 100, renderCell: (params) => <Chip label={normPlatform(params.value)} size="small" sx={getPlatformChipStyle(params.value)} /> },
    { field: 'platinado', headerName: 'Platinado', width: 100, align: 'center', headerAlign: 'center', renderCell: (params) => (params.value ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />) },
    { field: 'tempo_jogado_horas', headerName: 'Tempo (h)', width: 100, align: 'center', headerAlign: 'center', valueGetter: (value, row) => formatTotalTime(row.tempo_jogado_horas, row.tempo_jogado_minutos) },
  ];

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{
          backgroundColor: 'background.default',
          minHeight: '100vh',
          maxWidth: '1800px',
          mx: 'auto',
          p: { xs: 1, sm: 2, md: 3 }
        }}>
          <Paper sx={{ p: 2, mb: 3, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>Minha Coleção de Jogos</Typography>
            </Box>
          </Paper>
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            {Array.from(new Array(8)).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={2.4} sx={{ display: 'flex', justifyContent: 'center' }}>
                <SkeletonGameCard />
              </Grid>
            ))}
          </Grid>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
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
    <ThemeProvider theme={theme}>
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
        <TrophyCard games={games} />
        {viewMode === 'grid' ? (
          <Grid
            container
            spacing={3}
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            sx={{
              justifyContent: 'center',
              alignItems: 'stretch',
            }}>
            <AnimatePresence>
              {sortedGames.map((game) => (
                <Grid
                  item
                  key={game.id}
                  xs={12} sm={6} md={4} lg={3} xl={2.4}
                  component={motion.div}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <GameCard game={game} onClick={() => handleOpenDetails(game)} />
                </Grid>
              ))}
            </AnimatePresence>
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