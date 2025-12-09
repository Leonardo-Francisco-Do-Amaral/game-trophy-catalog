import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Alert,
  Collapse,
  Tooltip,
  Card,
  CardContent,
  CardMedia,
  Chip,
  LinearProgress,
  IconButton,
  Fade,
  Zoom,
  Stack,
  Container,
  useTheme,
  alpha,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Autocomplete
} from '@mui/material';
import {
  Search as SearchIcon,
  Save as SaveIcon,
  EmojiEvents as EmojiEventsIcon,
  VideogameAsset as GameIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  SportsEsports as PlatformIcon,
  Clear as ClearIcon,
  AutoAwesome as AutoAwesomeIcon,
  Edit as EditIcon,
  Add as AddIcon,
  PhotoCamera as PhotoIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Collections as CollectionsIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { api } from '../services/api';

const RAWG_API_KEY = '656d689bf531403b95aa1d95d29de23e';

const GRADIENTS = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  success: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
  info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  warning: 'linear-gradient(135deg, #fac070ff 0%, #fe5c26ff 100%)',
  dark: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
};

const initialFormData = {
  nome: '',
  foto_url: '',
  desenvolvedora: '',
  publicadora: '',
  ano_lancamento: '',
  genero: '',
  plataforma: '',
  tempo_jogado_horas: 0,
  tempo_jogado_minutos: 0,
  nota_gameplay: 0,
  nota_historia: 0,
  nota_trilha_sonora: 0,
  nota_total: 0,
  platinado: 'nao',
  tipo_jogo: 'digital',
  colocacao: '',
  status_online: 'exclusivamente_offline',
  idioma: 'legendado',
  trofeus_totais: 0,
  trofeus_obtidos: 0,
  trofeus_restantes: 0,
  trofeu_mais_dificil_percentual: 0,
  completude_jogo: 'nao_platinado',
  dificuldade_platina: 'medio',
  data_primeiro_trofeu: '',
  data_ultimo_trofeu: '',
  metacritic: '',
  dias_para_platina: 0,
  tags: [], // Initialize as empty array
};

const tagOptions = [
  'Estilo Anime',
  'Retro',
  'Brasileiro',
  'Vencedor do GOTY',
  'Opção de Romance',
  'Multiplos Finais',
  'Remaster/Remake'
];

const platformOptions = [
  'PlayStation 5', 'PlayStation 4', 'PlayStation 3', 'PlayStation 2', 'PlayStation',
  'PlayStation Portable', 'PlayStation Vita', 'Xbox Series X/S', 'Xbox One', 'Xbox 360',
  'Xbox', 'Nintendo Switch', 'Nintendo 3DS', 'Nintendo DS', 'Wii U', 'Wii', 'GameCube',
  'Nintendo 64', 'Super Nintendo', 'Nintendo Entertainment System', 'PC', 'Steam Deck',
  'Mobile (iOS)', 'Mobile (Android)', 'Arcade', 'Outra'
];

function CadastroJogo({ onNavigate, gameIdToEdit }) {
  const theme = useTheme();
  const formRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customPlatform, setCustomPlatform] = useState('');
  const [manualEntry, setManualEntry] = useState(false);

  // Image Selection Dialog State
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [imageTab, setImageTab] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  useEffect(() => {
    const nGameplay = parseFloat(formData.nota_gameplay) || 0;
    const nHistoria = parseFloat(formData.nota_historia) || 0;
    const nTrilha = parseFloat(formData.nota_trilha_sonora) || 0;
    const media = (nGameplay + nHistoria + nTrilha) / 3;
    setFormData(prev => ({ ...prev, nota_total: media.toFixed(1) }));
  }, [formData.nota_gameplay, formData.nota_historia, formData.nota_trilha_sonora]);

  useEffect(() => {
    const restantes = (formData.trofeus_totais || 0) - (formData.trofeus_obtidos || 0);
    setFormData(prev => ({ ...prev, trofeus_restantes: restantes < 0 ? 0 : restantes }));
  }, [formData.trofeus_totais, formData.trofeus_obtidos]);

  useEffect(() => {
    if (formData.data_primeiro_trofeu && formData.data_ultimo_trofeu) {
      const start = new Date(formData.data_primeiro_trofeu);
      const end = new Date(formData.data_ultimo_trofeu);
      if (start <= end) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setFormData(prev => ({ ...prev, dias_para_platina: diffDays }));
      }
    }
  }, [formData.data_primeiro_trofeu, formData.data_ultimo_trofeu]);

  useEffect(() => {
    if ((selectedGame || manualEntry) && formRef.current) {
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [selectedGame, manualEntry]);

  useEffect(() => {
    const editMode = !!gameIdToEdit;
    setIsEditMode(editMode);

    if (editMode) {
      setSelectedGame(true);
      setManualEntry(false);
      setSearchResults([]);

      const fetchGameData = async () => {
        setLoadingDetails(true);
        try {
          const data = await api.getGameById(gameIdToEdit);
          const formattedData = {
            ...data,
            platinado: data.platinado ? 'sim' : 'nao',
            status_online: data.status_online ? data.status_online.replace(/ /g, '_') : 'exclusivamente_offline',
            completude_jogo: data.completude_jogo ? data.completude_jogo.replace(/ /g, '_') : 'nao_platinado',
            dificuldade_platina: data.dificuldade_platina ? data.dificuldade_platina.replace(/ /g, '_') : 'medio',
            data_primeiro_trofeu: data.data_primeiro_trofeu ? new Date(data.data_primeiro_trofeu).toISOString().split('T')[0] : '',
            data_ultimo_trofeu: data.data_ultimo_trofeu ? new Date(data.data_ultimo_trofeu).toISOString().split('T')[0] : '',
            tempo_jogado_horas: data.tempo_jogado_horas || 0,
            tempo_jogado_minutos: data.tempo_jogado_minutos || 0,
            nota_gameplay: data.nota_gameplay || 0,
            nota_historia: data.nota_historia || 0,
            nota_trilha_sonora: data.nota_trilha_sonora || 0,
            trofeus_totais: data.trofeus_totais || 0,
            trofeus_obtidos: data.trofeus_obtidos || 0,
          };
          setFormData(formattedData);
        } catch (error) {
          enqueueSnackbar(`Erro ao carregar jogo: ${error.message}`, { variant: 'error' });
        } finally {
          setLoadingDetails(false);
        }
      };
      fetchGameData();
    } else {
      resetFormAndSearch();
    }
  }, [gameIdToEdit, enqueueSnackbar]);

  const resetFormAndSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSearchError('');
    setSelectedGame(null);
    setFormData(initialFormData);
    setCustomPlatform('');
    setManualEntry(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleManualEntry = () => {
    setManualEntry(true);
    setSelectedGame(null);
    setSearchResults([]);
    setSearchError('');
    setFormData(initialFormData);
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoadingSearch(true);
    setSearchError('');
    setSearchResults([]);
    setSelectedGame(null);
    setManualEntry(false);
    try {
      const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(searchTerm)}&page_size=12`);
      if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
      const data = await response.json();
      if (data.results.length === 0) setSearchError('Nenhum jogo encontrado.');
      setSearchResults(data.results);
    } catch (error) {
      setSearchError('Falha ao buscar jogos.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSelectGame = async (gameFromSearch) => {
    setLoadingDetails(true);
    setSearchError('');
    setSearchResults([]);
    setSearchTerm(gameFromSearch.name);
    setManualEntry(false);

    try {
      const detailUrl = `https://api.rawg.io/api/games/${gameFromSearch.id}?key=${RAWG_API_KEY}`;
      const achievementsUrl = `https://api.rawg.io/api/games/${gameFromSearch.id}/achievements?key=${RAWG_API_KEY}`;

      const [detailsResponse, achievementsResponse] = await Promise.all([
        fetch(detailUrl),
        fetch(achievementsUrl)
      ]);

      if (!detailsResponse.ok) throw new Error('Falha ao buscar detalhes do jogo.');

      const fullGameDetails = await detailsResponse.json();
      const achievementsData = achievementsResponse.ok ? await achievementsResponse.json() : { count: 0, results: [] };

      setSelectedGame(fullGameDetails);

      setFormData(prev => ({
        ...initialFormData,
        nome: fullGameDetails.name || '',
        foto_url: fullGameDetails.background_image || '',
        ano_lancamento: fullGameDetails.released ? fullGameDetails.released.split('-')[0] : '',
        desenvolvedora: fullGameDetails.developers?.map(d => d.name).join(', ') || '',
        publicadora: fullGameDetails.publishers?.map(p => p.name).join(', ') || '',
        genero: fullGameDetails.genres?.map(g => g.name).join(' - ') || '',
        plataforma: fullGameDetails.platforms?.length > 0
          ? (platformOptions.includes(fullGameDetails.platforms[0].platform.name)
            ? fullGameDetails.platforms[0].platform.name
            : 'Outra')
          : '',
        trofeus_totais: achievementsData.count || 0,
        metacritic: fullGameDetails.metacritic || '',
      }));

      if (fullGameDetails.platforms?.length > 0 && !platformOptions.includes(fullGameDetails.platforms[0].platform.name)) {
        setCustomPlatform(fullGameDetails.platforms[0].platform.name);
      } else {
        setCustomPlatform('');
      }

    } catch (error) {
      setSearchError(error.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, plataforma: value }));
    if (value !== 'Outra') setCustomPlatform('');
  };

  const handleCustomPlatformChange = (e) => {
    setCustomPlatform(e.target.value);
    setFormData(prev => ({ ...prev, plataforma: e.target.value }));
  };

  const handleReloadImage = async () => {
    if (!formData.nome) return;

    try {
      // 1. Search for the game to get ID
      const searchResponse = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(formData.nome)}&page_size=1`);
      const searchData = await searchResponse.json();

      if (searchData.results && searchData.results.length > 0) {
        const gameId = searchData.results[0].id;

        // 2. Fetch screenshots
        const screenshotsResponse = await fetch(`https://api.rawg.io/api/games/${gameId}/screenshots?key=${RAWG_API_KEY}`);
        const screenshotsData = await screenshotsResponse.json();

        if (screenshotsData.results && screenshotsData.results.length > 0) {
          // Pick a random screenshot
          const randomScreenshot = screenshotsData.results[Math.floor(Math.random() * screenshotsData.results.length)];
          setFormData(prev => ({ ...prev, foto_url: randomScreenshot.image }));
          enqueueSnackbar('Nova imagem gerada com sucesso!', { variant: 'success' });
        } else {
          enqueueSnackbar('Nenhuma outra imagem encontrada para este jogo.', { variant: 'warning' });
        }
      } else {
        enqueueSnackbar('Jogo não encontrado na API para buscar imagens.', { variant: 'warning' });
      }
    } catch (error) {
      console.error('Erro ao buscar imagem:', error);
      enqueueSnackbar('Erro ao buscar nova imagem.', { variant: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSubmit = {
      ...formData,
      platinado: formData.platinado === 'sim',
      status_online: formData.status_online.replace(/_/g, ' '),
      completude_jogo: formData.completude_jogo.replace(/_/g, ' '),
      dificuldade_platina: formData.dificuldade_platina.replace(/_/g, ' '),
      plataforma: formData.plataforma === 'Outra' ? customPlatform : formData.plataforma,
    };

    try {
      if (isEditMode) {
        await api.updateGame(gameIdToEdit, dataToSubmit);
        enqueueSnackbar('Jogo atualizado com sucesso!', { variant: 'success' });
        setTimeout(() => onNavigate('listaJogos'), 1500);
      } else {
        await api.createGame(dataToSubmit);
        enqueueSnackbar('Jogo salvo com sucesso!', { variant: 'success' });
        resetFormAndSearch();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Erro ao salvar o jogo.', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenImageDialog = async () => {
    setOpenImageDialog(true);
    setImageTab(0);

    if (formData.nome && galleryImages.length === 0) {
      setLoadingGallery(true);
      try {
        const searchResponse = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(formData.nome)}&page_size=1`);
        const searchData = await searchResponse.json();

        if (searchData.results && searchData.results.length > 0) {
          const gameId = searchData.results[0].id;
          const screenshotsResponse = await fetch(`https://api.rawg.io/api/games/${gameId}/screenshots?key=${RAWG_API_KEY}`);
          const screenshotsData = await screenshotsResponse.json();

          if (screenshotsData.results) {
            setGalleryImages(screenshotsData.results);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar galeria:', error);
        enqueueSnackbar('Erro ao carregar galeria de imagens.', { variant: 'error' });
      } finally {
        setLoadingGallery(false);
      }
    }
  };

  const handleImageTabChange = (event, newValue) => {
    setImageTab(newValue);
  };

  const handleGallerySelect = (url) => {
    setFormData(prev => ({ ...prev, foto_url: url }));
    setOpenImageDialog(false);
    enqueueSnackbar('Imagem selecionada com sucesso!', { variant: 'success' });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, foto_url: reader.result }));
        setOpenImageDialog(false);
        enqueueSnackbar('Imagem carregada com sucesso!', { variant: 'success' });
      };
      reader.readAsDataURL(file);
    }
  };

  const getProgressPercentage = () => {
    if (!formData.trofeus_totais || formData.trofeus_totais === 0) return 0;
    return (formData.trofeus_obtidos / formData.trofeus_totais) * 100;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {!isEditMode && (
        <Paper elevation={12} sx={{
          background: GRADIENTS.primary,
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }
        }}>
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center' }}>
              <GameIcon sx={{ mr: 2, fontSize: 'inherit' }} />
              Gaming Catalog Pro
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
              Sistema Avançado de Cadastro de Jogos
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Adicione jogos através da busca automática ou cadastre manualmente com controle total sobre todos os dados
            </Typography>
          </Box>
        </Paper>
      )}

      {!isEditMode && (
        <Paper elevation={8} sx={{
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          p: 3,
          mb: 4,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SearchIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, flexGrow: 1 }}>
              Buscar Jogo na Base de Dados
            </Typography>
            <Tooltip title="Cadastrar manualmente sem buscar">
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleManualEntry}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Cadastro Manual
              </Button>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Digite o nome do jogo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '&.Mui-focused fieldset': { borderWidth: 2 }
                }
              }}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={resetFormAndSearch}><ClearIcon /></IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loadingSearch || !searchTerm}
              sx={{
                px: 4, py: 1.75, borderRadius: 2, background: GRADIENTS.info, transition: 'all 0.3s ease', fontWeight: 600, minWidth: 120,
                '&:hover': { transform: 'translateY(-2px)', boxShadow: theme.shadows[8] }
              }}
            >
              {loadingSearch ? <CircularProgress size={24} color="inherit" /> : 'Buscar'}
            </Button>
          </Box>

          {searchError && (
            <Fade in>
              <Alert severity="warning" sx={{ borderRadius: 2, '& .MuiAlert-icon': { fontSize: 24 } }}>{searchError}</Alert>
            </Fade>
          )}
        </Paper>
      )}

      {(loadingDetails || searchResults.length > 0) && (
        <Box sx={{ my: 4 }}>
          {loadingDetails ? (
            <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography variant="h6" color="text.secondary">Carregando detalhes de <strong>{searchTerm}</strong>...</Typography>
            </Paper>
          ) : (
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Resultados da Busca ({searchResults.length} jogos encontrados)</Typography>
              <Grid container spacing={3}>
                {searchResults.map((game, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
                    <Zoom in style={{ transitionDelay: `${index * 100}ms` }}>
                      <Card
                        onClick={() => handleSelectGame(game)}
                        sx={{
                          height: '100%', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', borderRadius: 2, overflow: 'hidden',
                          '&:hover': { transform: 'translateY(-8px) scale(1.02)', boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.3)}` }
                        }}
                      >
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                          <CardMedia component="img" height="160" image={game.background_image} alt={game.name} sx={{ transition: 'transform 0.4s ease', filter: 'brightness(0.9)' }} />
                          <Box sx={{ position: 'absolute', top: 8, right: 8, background: alpha('#000', 0.7), borderRadius: 1, px: 1, py: 0.5 }}>
                            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>{game.released?.split('-')[0] || 'N/A'}</Typography>
                          </Box>
                        </Box>
                        <CardContent sx={{ p: 2 }}>
                          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {game.name}
                          </Typography>
                          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                            {game.parent_platforms?.slice(0, 3).map(p => (<Chip key={p.platform.id} label={p.platform.name} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />))}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Box>
      )}

      <Box ref={formRef}>
        <Collapse in={!!(selectedGame || manualEntry || isEditMode)} timeout={600}>
          {(selectedGame || manualEntry || isEditMode) && (
            <Box component="form" onSubmit={handleSubmit}>
              {isEditMode && !loadingDetails && (
                <Alert icon={<EditIcon />} severity="info" sx={{ mb: 4, borderRadius: 2, fontSize: '1rem' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>Modo de Edição</Typography>
                  <Typography variant="body2">Você está editando o jogo <strong>{formData.nome}</strong>. Altere os campos desejados e salve.</Typography>
                </Alert>
              )}
              {selectedGame && formData.foto_url && (
                <Paper elevation={12} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                  <Box sx={{ position: 'relative', height: { xs: 250, sm: 350 } }}>
                    <CardMedia component="img" height="350" image={formData.foto_url} alt={formData.nome} sx={{ objectFit: 'cover', filter: 'brightness(0.7)' }} />
                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', p: 4, color: 'white' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>{formData.nome}</Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9 }}>{formData.desenvolvedora} • {formData.ano_lancamento}</Typography>
                    </Box>
                  </Box>
                </Paper>
              )}

              {manualEntry && (
                <Alert icon={<InfoIcon />} severity="info" sx={{ mb: 4, borderRadius: 2, fontSize: '1rem' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>Modo de Cadastro Manual Ativado</Typography>
                  <Typography variant="body2">Preencha todos os campos manualmente. Você tem controle total sobre as informações do jogo.</Typography>
                </Alert>
              )}

              <Paper elevation={6} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ background: GRADIENTS.dark, color: 'white', p: 3, display: 'flex', alignItems: 'center' }}>
                  <GameIcon sx={{ mr: 2, fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, flexGrow: 1 }}>Dados Básicos do Jogo</Typography>
                  <Chip icon={<EditIcon />} label="Editável" size="small" sx={{ background: alpha('#fff', 0.2), color: 'white' }} />
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Nome do Jogo" name="nome" value={formData.nome} onChange={handleChange} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Ano de Lançamento" name="ano_lancamento" value={formData.ano_lancamento} onChange={handleChange} type="number" InputProps={{ inputProps: { min: 1970, max: new Date().getFullYear() + 5 } }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <TextField fullWidth label="Desenvolvedora" name="desenvolvedora" value={formData.desenvolvedora} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <TextField fullWidth label="Publicadora" name="publicadora" value={formData.publicadora} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Gênero(s)" name="genero" value={formData.genero} onChange={handleChange} placeholder="Ex: Action, Adventure, RPG" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="URL da Imagem"
                        name="foto_url"
                        value={formData.foto_url}
                        onChange={handleChange}
                        placeholder="https://exemplo.com/imagem.jpg"
                        InputProps={{
                          startAdornment: (<InputAdornment position="start"><PhotoIcon color="action" /></InputAdornment>),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title="Selecionar imagem (Galeria ou Upload)">
                                <IconButton onClick={handleOpenImageDialog} edge="end">
                                  <CollectionsIcon />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          )
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }}>
                        <InputLabel>Plataforma *</InputLabel>
                        <Select name="plataforma" value={formData.plataforma} label="Plataforma *" onChange={handlePlatformChange} required>
                          {platformOptions.map((option) => (<MenuItem key={option} value={option}><Box sx={{ display: 'flex', alignItems: 'center' }}><PlatformIcon sx={{ mr: 1, fontSize: 20 }} />{option}</Box></MenuItem>))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {formData.plataforma === 'Outra' && (
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Nome da Plataforma (Personalizada)" value={customPlatform} onChange={handleCustomPlatformChange} required placeholder="Digite o nome da plataforma" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                      </Grid>
                    )}

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }}>
                        <InputLabel>Tipo de Jogo</InputLabel>
                        <Select name="tipo_jogo" value={formData.tipo_jogo} label="Tipo de Jogo" onChange={handleChange}>
                          <MenuItem value="digital">🔗 Digital</MenuItem>
                          <MenuItem value="fisica">💿 Física</MenuItem>
                          <MenuItem value="ps_plus">🎮 PS-Plus</MenuItem>
                          <MenuItem value="gratis">🆓 Grátis</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Colocação na Lista" name="colocacao" value={formData.colocacao} onChange={handleChange} type="number" placeholder="Posição do jogo na sua lista pessoal" InputProps={{ inputProps: { min: 1 } }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Paper>

              <Paper elevation={6} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ background: GRADIENTS.warning, color: 'white', p: 3, display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon sx={{ mr: 2, fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Tempo Jogado e Avaliações</Typography>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Tempo Jogado (Horas)" name="tempo_jogado_horas" type="number" value={formData.tempo_jogado_horas} onChange={handleChange} InputProps={{ inputProps: { min: 0 }, startAdornment: <InputAdornment position="start">⏰</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Tempo Jogado (Minutos)" name="tempo_jogado_minutos" type="number" value={formData.tempo_jogado_minutos} onChange={handleChange} InputProps={{ inputProps: { min: 0, max: 59 }, startAdornment: <InputAdornment position="start">⏱️</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>
                    <Grid item xs={12}><Divider sx={{ my: 2 }}><Chip icon={<StarIcon />} label="Avaliações (0-10)" /></Divider></Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField fullWidth label="Nota Gameplay" name="nota_gameplay" type="number" value={formData.nota_gameplay} onChange={handleChange} InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 }, startAdornment: <InputAdornment position="start">🎮</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField fullWidth label="Nota História" name="nota_historia" type="number" value={formData.nota_historia} onChange={handleChange} InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 }, startAdornment: <InputAdornment position="start">📖</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField fullWidth label="Nota Trilha Sonora" name="nota_trilha_sonora" type="number" value={formData.nota_trilha_sonora} onChange={handleChange} InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 }, startAdornment: <InputAdornment position="start">🎵</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField fullWidth label="Metacritic" name="metacritic" type="number" value={formData.metacritic} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">Ⓜ️</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.info.light, 0.1) } }} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={tagOptions}
                        getOptionLabel={(option) => option}
                        value={(() => {
                          if (Array.isArray(formData.tags)) return formData.tags;
                          if (typeof formData.tags === 'string') {
                            try {
                              return formData.tags.startsWith('[') ? JSON.parse(formData.tags) : (formData.tags ? [formData.tags] : []);
                            } catch (e) {
                              return formData.tags ? [formData.tags] : [];
                            }
                          }
                          return [];
                        })()}
                        onChange={(event, newValue) => {
                          setFormData({ ...formData, tags: newValue });
                        }}
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tags Especiais"
                            placeholder="Selecione tags"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.secondary.light, 0.1) } }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Nota Total (Média Automática)" name="nota_total" value={formData.nota_total} InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start">⭐</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.success.light, 0.1) } }} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Paper>

              <Paper elevation={6} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ background: GRADIENTS.secondary, color: 'white', p: 3, display: 'flex', alignItems: 'center' }}>
                  <EmojiEventsIcon sx={{ mr: 2, fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>Troféus e Conquistas</Typography>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }}>
                        <InputLabel>Platinado?</InputLabel>
                        <Select name="platinado" value={formData.platinado} label="Platinado?" onChange={handleChange}>
                          <MenuItem value="sim">🏆 Sim</MenuItem>
                          <MenuItem value="nao">❌ Não</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }}>
                        <InputLabel>Dificuldade da Platina</InputLabel>
                        <Select name="dificuldade_platina" value={formData.dificuldade_platina} label="Dificuldade da Platina" onChange={handleChange}>
                          <MenuItem value="facil">🟢 Fácil</MenuItem>
                          <MenuItem value="medio">🟡 Médio</MenuItem>
                          <MenuItem value="dificil">🟠 Difícil</MenuItem>
                          <MenuItem value="extremamente_dificil">🔴 Extremamente Difícil</MenuItem>
                          <MenuItem value="impossivel">⚫ Impossível</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Troféus Totais" name="trofeus_totais" type="number" value={formData.trofeus_totais} onChange={handleChange} InputProps={{ inputProps: { min: 0 }, startAdornment: <InputAdornment position="start">🏅</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Troféus Obtidos" name="trofeus_obtidos" type="number" value={formData.trofeus_obtidos} onChange={handleChange} InputProps={{ inputProps: { min: 0 }, startAdornment: <InputAdornment position="start">✅</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField fullWidth label="Troféus Restantes (Calculado Automaticamente)" name="trofeus_restantes" value={formData.trofeus_restantes} InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start">⏳</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.info.light, 0.1) } }} />
                    </Grid>

                    {formData.trofeus_totais > 0 && (
                      <Grid item xs={12}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>Progresso de Troféus: {getProgressPercentage().toFixed(1)}%</Typography>
                          <LinearProgress variant="determinate" value={getProgressPercentage()} sx={{ height: 8, borderRadius: 4, backgroundColor: alpha(theme.palette.grey[300], 0.3), '& .MuiLinearProgress-bar': { borderRadius: 4, background: getProgressPercentage() === 100 ? GRADIENTS.success : GRADIENTS.info } }} />
                        </Box>
                      </Grid>
                    )}

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Data Primeiro Troféu" name="data_primeiro_trofeu" type="date" value={formData.data_primeiro_trofeu} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Data Último Troféu" name="data_ultimo_trofeu" type="date" value={formData.data_ultimo_trofeu} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Dias para Platina (Calculado Automaticamente)" name="dias_para_platina" type="number" value={formData.dias_para_platina} InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start">📅</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.success.light, 0.1) } }} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }}>
                        <InputLabel>Completude do Jogo</InputLabel>
                        <Select name="completude_jogo" value={formData.completude_jogo} label="Completude do Jogo" onChange={handleChange}>
                          <MenuItem value="nao_platinado">❌ Não Platinado</MenuItem>
                          <MenuItem value="100%">💯 100%</MenuItem>
                          <MenuItem value="incompleto">⏳ Incompleto</MenuItem>
                          <MenuItem value="platinado_com_dlc">🏆 Platinado com DLC</MenuItem>
                          <MenuItem value="platinado_sem_dlc">✨ Platinado sem DLC</MenuItem>
                          <MenuItem value="platinado_nao_possui_dlc">✅ Platinado (Não possui DLC)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Paper>

              <Paper elevation={6} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ background: GRADIENTS.info, color: 'white', p: 3, display: 'flex', alignItems: 'center' }}>
                  <AutoAwesomeIcon sx={{ mr: 2, fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>Configurações Adicionais</Typography>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }}>
                        <InputLabel>Idioma</InputLabel>
                        <Select name="idioma" value={formData.idioma} label="Idioma" onChange={handleChange}>
                          <MenuItem value="dublado">🎤 Dublado</MenuItem>
                          <MenuItem value="legendado">📝 Legendado</MenuItem>
                          <MenuItem value="ingles">🇬🇧 Inglês</MenuItem>
                          <MenuItem value="espanhol">🇪🇸 Espanhol</MenuItem>
                          <MenuItem value="japones">🇯🇵 Japonês</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }}>
                        <InputLabel>Status Online</InputLabel>
                        <Select name="status_online" value={formData.status_online} label="Status Online" onChange={handleChange}>
                          <MenuItem value="exclusivamente_offline">📱 Exclusivamente Offline</MenuItem>
                          <MenuItem value="Hibrido">🔗 Hibrido</MenuItem>
                          <MenuItem value="exclusivamente_online">☁️ Exclusivamente Online</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Troféu Mais Difícil (%)" name="trofeu_mais_dificil_percentual" type="number" value={formData.trofeu_mais_dificil_percentual} onChange={handleChange} InputProps={{ inputProps: { min: 0, max: 100, step: 0.01 }, startAdornment: <InputAdornment position="start">💎</InputAdornment>, endAdornment: <InputAdornment position="end">%</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Paper>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    px: 6, py: 2, borderRadius: 3, background: GRADIENTS.success, color: 'white', fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'none', boxShadow: theme.shadows[8], transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { transform: 'translateY(-4px) scale(1.02)', boxShadow: theme.shadows[16], background: GRADIENTS.success },
                    '&:active': { transform: 'translateY(-2px) scale(0.98)' }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                      {isEditMode ? 'Salvando Alterações...' : 'Salvando Jogo...'}
                    </>
                  ) : (
                    <>
                      <SaveIcon sx={{ mr: 2 }} />
                      {isEditMode ? 'Salvar Alterações' : 'Salvar Jogo na Coleção'}
                    </>
                  )}
                </Button>
              </Box>
            </Box>
          )}
        </Collapse>
      </Box>
      <Dialog
        open={openImageDialog}
        onClose={() => setOpenImageDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, background: alpha(theme.palette.background.paper, 0.95), backdropFilter: 'blur(10px)' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>Selecionar Imagem</Typography>
          <IconButton onClick={() => setOpenImageDialog(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Tabs value={imageTab} onChange={handleImageTabChange} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<CollectionsIcon />} label="Galeria Online" />
            <Tab icon={<CloudUploadIcon />} label="Upload do PC" />
          </Tabs>

          <Box sx={{ p: 3, minHeight: 400 }}>
            {imageTab === 0 && (
              <Box>
                {loadingGallery ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                    <CircularProgress />
                  </Box>
                ) : galleryImages.length > 0 ? (
                  <ImageList cols={3} gap={16} rowHeight={160}>
                    {galleryImages.map((item) => (
                      <ImageListItem key={item.id} sx={{ cursor: 'pointer', overflow: 'hidden', borderRadius: 2, '&:hover img': { transform: 'scale(1.1)' } }} onClick={() => handleGallerySelect(item.image)}>
                        <img
                          src={item.image}
                          alt="Screenshot"
                          loading="lazy"
                          style={{ height: '100%', width: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8, opacity: 0.7 }}>
                    <Typography>Nenhuma imagem encontrada na galeria.</Typography>
                    <Typography variant="caption">Tente digitar o nome do jogo corretamente.</Typography>
                  </Box>
                )}
              </Box>
            )}

            {imageTab === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, border: '2px dashed', borderColor: 'divider', borderRadius: 4, p: 4 }}>
                <CloudUploadIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Arraste uma imagem ou clique para selecionar</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Suporta JPG, PNG, WEBP</Typography>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{ borderRadius: 2, px: 4, py: 1.5 }}
                >
                  Selecionar Arquivo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default CadastroJogo;
