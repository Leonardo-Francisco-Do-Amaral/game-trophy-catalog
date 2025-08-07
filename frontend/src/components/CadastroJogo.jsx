// src/components/CadastroJogo.jsx

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
  Avatar,
  Divider,
  Paper
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
  Info as InfoIcon
} from '@mui/icons-material';

const RAWG_API_KEY = '656d689bf531403b95aa1d95d29de23e';


const GRADIENTS = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  success: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
  info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  warning: 'linear-gradient(135deg, #fac070ff 0%, #fe5c26ff 100%)',
  dark: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
};

// Estado inicial do formulário
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
  dias_para_platina: 0,
};

// Opções de plataforma expandidas
const platformOptions = [
  'PlayStation 5',
  'PlayStation 4',
  'PlayStation 3',
  'PlayStation 2',
  'PlayStation',
  'PlayStation Portable',
  'PlayStation Vita',
  'Xbox Series X/S',
  'Xbox One',
  'Xbox 360',
  'Xbox',
  'Nintendo Switch',
  'Nintendo 3DS',
  'Nintendo DS',
  'Wii U',
  'Wii',
  'GameCube',
  'Nintendo 64',
  'Super Nintendo',
  'Nintendo Entertainment System',
  'PC',
  'Steam Deck',
  'Mobile (iOS)',
  'Mobile (Android)',
  'Arcade',
  'Outra'
];

function CadastroJogo({ onNavigate, gameIdToEdit }) { 
  const theme = useTheme();
  const formRef = useRef(null);

   const [isEditMode, setIsEditMode] = useState(false);

  // Estados para busca e dados
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [platinumTrophyImage, setPlatinumTrophyImage] = useState(null);

  const [formData, setFormData] = useState(initialFormData);
  const [submitStatus, setSubmitStatus] = useState({ status: 'idle', message: '' });
  const [customPlatform, setCustomPlatform] = useState('');
  const [manualEntry, setManualEntry] = useState(false); // Novo estado para entrada manual

  // --- HOOKS DE EFEITO ---
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
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
  }, [selectedGame, manualEntry]);

   useEffect(() => {
    // Identifica se estamos em modo de edição
    const editMode = !!gameIdToEdit;
    setIsEditMode(editMode);

    if (editMode) {
      console.log(`Modo de Edição Ativado para o Jogo ID: ${gameIdToEdit}`);
      
      // Desativa a busca e o cadastro manual para focar na edição
      setSelectedGame(true); // "Trava" o formulário como se um jogo tivesse sido selecionado
      setManualEntry(false); 
      setSearchResults([]);
      
      const fetchGameData = async () => {
        setLoadingDetails(true);
        try {
          const response = await fetch(`http://localhost:3001/api/jogos/${gameIdToEdit}`);
          if (!response.ok) {
            throw new Error('Não foi possível carregar os dados do jogo para edição.');
          }
          const data = await response.json();

          // Ajusta os dados para o formato do formulário
          const formattedData = {
              ...data,
              platinado: data.platinado ? 'sim' : 'nao',
              status_online: data.status_online ? data.status_online.replace(/ /g, '_') : 'exclusivamente_offline',
              completude_jogo: data.completude_jogo ? data.completude_jogo.replace(/ /g, '_') : 'nao_platinado',
              dificuldade_platina: data.dificuldade_platina ? data.dificuldade_platina.replace(/ /g, '_') : 'medio',
              data_primeiro_trofeu: data.data_primeiro_trofeu ? new Date(data.data_primeiro_trofeu).toISOString().split('T')[0] : '',
              data_ultimo_trofeu: data.data_ultimo_trofeu ? new Date(data.data_ultimo_trofeu).toISOString().split('T')[0] : '',
              // Garante que campos numéricos nulos virem 0
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
          setSubmitStatus({ status: 'error', message: error.message });
        } finally {
          setLoadingDetails(false);
        }
      };

      fetchGameData();
    } else {
      // Se não for modo de edição, reseta tudo para o estado inicial de cadastro
      resetFormAndSearch();
    }
  }, [gameIdToEdit]); 

  // --- FUNÇÕES DE MANIPULAÇÃO ---

  const resetFormAndSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSearchError('');
    setSelectedGame(null);
    setPlatinumTrophyImage(null);
    setFormData(initialFormData);
    setCustomPlatform('');
    setManualEntry(false);
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
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
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.results.length === 0) {
        setSearchError('Nenhum jogo encontrado.');
      }
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
    setPlatinumTrophyImage(null);
    setManualEntry(false);

    try {
      const detailUrl = `https://api.rawg.io/api/games/${gameFromSearch.id}?key=${RAWG_API_KEY}`;
      const achievementsUrl = `https://api.rawg.io/api/games/${gameFromSearch.id}/achievements?key=${RAWG_API_KEY}`;

      const [detailsResponse, achievementsResponse] = await Promise.all([
          fetch(detailUrl),
          fetch(achievementsUrl)
      ]);

      if (!detailsResponse.ok) {
        throw new Error('Falha ao buscar detalhes do jogo.');
      }

      const fullGameDetails = await detailsResponse.json();
      const achievementsData = achievementsResponse.ok ? await achievementsResponse.json() : { count: 0, results: [] };

      const platTrophy = achievementsData.results.find(
          ach => ach.name.toLowerCase().includes('platinum') || ach.name.toLowerCase().includes('todos os troféus')
      );
      if (platTrophy) {
        setPlatinumTrophyImage(platTrophy.image);
      }

      setSelectedGame(fullGameDetails);

      // Preenche o formulário com os dados da API
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
      }));

      // Se a plataforma não estiver nas opções predefinidas, preenche o campo customizado
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlatformChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, plataforma: value }));
    if (value !== 'Outra') {
      setCustomPlatform('');
    }
  };

  const handleCustomPlatformChange = (e) => {
    setCustomPlatform(e.target.value);
    setFormData(prev => ({ ...prev, plataforma: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ status: 'submitting', message: '' });

    const dataToSubmit = {
      ...formData,
      platinado: formData.platinado === 'sim',
      status_online: formData.status_online.replace(/_/g, ' '),
      completude_jogo: formData.completude_jogo.replace(/_/g, ' '),
      dificuldade_platina: formData.dificuldade_platina.replace(/_/g, ' '),
      plataforma: formData.plataforma === 'Outra' ? customPlatform : formData.plataforma,
    };
    
     const endpoint = isEditMode 
      ? `http://localhost:3001/api/jogos/${gameIdToEdit}` 
      : 'http://localhost:3001/api/jogos';

       const method = isEditMode ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar o jogo.');
      }

      const successMessage = isEditMode 
        ? 'Jogo atualizado com sucesso! Redirecionando...' 
        : 'Jogo salvo com sucesso! Você já pode cadastrar o próximo.';
      
      setSubmitStatus({ status: 'success', message: successMessage });
      
      setTimeout(() => {
        if (isEditMode) {
          onNavigate('listaJogos'); // Volta para a lista após editar
        } else {
          resetFormAndSearch();
          setSubmitStatus({ status: 'idle', message: '' });
        }
      }, 3000);

    } catch (error) {
      setSubmitStatus({ status: 'error', message: error.message });
    }
  };
  
  // --- FUNÇÕES AUXILIARES ---
  const getProgressPercentage = () => {
    if (!formData.trofeus_totais || formData.trofeus_totais === 0) return 0;
    return (formData.trofeus_obtidos / formData.trofeus_totais) * 100;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      facil: theme.palette.success.main,
      medio: theme.palette.warning.main,
      dificil: theme.palette.error.main,
      extremamente_dificil: theme.palette.secondary.main,
      impossivel: '#000'
    };
    return colors[difficulty] || theme.palette.grey[500];
  };

  // --- RENDERIZAÇÃO ---

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabeçalho Melhorado */}

      {!isEditMode && (
          <Paper /* ... Seção de Busca */ >
              {/* ... (todo o conteúdo da busca aqui) */}
          </Paper>
      )}
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

      {/* Seção de Busca Melhorada */}
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
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
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
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={resetFormAndSearch}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loadingSearch || !searchTerm}
            sx={{ 
              px: 4, 
              py: 1.75,
              borderRadius: 2, 
              background: GRADIENTS.info, 
              transition: 'all 0.3s ease',
              fontWeight: 600,
              minWidth: 120,
              '&:hover': { 
                transform: 'translateY(-2px)', 
                boxShadow: theme.shadows[8] 
              } 
            }}
          >
            {loadingSearch ? <CircularProgress size={24} color="inherit" /> : 'Buscar'}
          </Button>
        </Box>
        
        {searchError && (
          <Fade in>
            <Alert severity="warning" sx={{ borderRadius: 2, '& .MuiAlert-icon': { fontSize: 24 } }}>
              {searchError}
            </Alert>
          </Fade>
        )}
      </Paper>

      {/* Resultados da Busca */}
      {(loadingDetails || searchResults.length > 0) && (
        <Box sx={{ my: 4 }}>
          {loadingDetails ? (
            <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Carregando detalhes de <strong>{searchTerm}</strong>...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Buscando informações completas do jogo
              </Typography>
            </Paper>
          ) : (
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Resultados da Busca ({searchResults.length} jogos encontrados)
              </Typography>
              <Grid container spacing={3}>
                {searchResults.map((game, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
                    <Zoom in style={{ transitionDelay: `${index * 100}ms` }}>
                      <Card
                        onClick={() => handleSelectGame(game)}
                        sx={{ 
                          height: '100%', 
                          cursor: 'pointer', 
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          borderRadius: 2,
                          overflow: 'hidden',
                          '&:hover': { 
                            transform: 'translateY(-8px) scale(1.02)', 
                            boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
                            '& .game-image': {
                              transform: 'scale(1.1)'
                            }
                          }
                        }}
                      >
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                          <CardMedia 
                            component="img" 
                            height="160" 
                            image={game.background_image} 
                            alt={game.name}
                            className="game-image"
                            sx={{ 
                              transition: 'transform 0.4s ease',
                              filter: 'brightness(0.9)'
                            }}
                          />
                          <Box sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            background: alpha('#000', 0.7),
                            borderRadius: 1,
                            px: 1,
                            py: 0.5
                          }}>
                            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                              {game.released?.split('-')[0] || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                        <CardContent sx={{ p: 2 }}>
                          <Typography 
                            gutterBottom 
                            variant="h6" 
                            component="div" 
                            sx={{ 
                              fontWeight: 600, 
                              lineHeight: 1.3,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {game.name}
                          </Typography>
                          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                            {game.parent_platforms?.slice(0, 3).map(p => ( 
                              <Chip 
                                key={p.platform.id} 
                                label={p.platform.name} 
                                size="small" 
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              /> 
                            ))}
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
      
      {/* Formulário Principal */}
      <Box ref={formRef}>
       <Collapse in={!!(selectedGame || manualEntry || isEditMode)} timeout={600}>
          {(selectedGame || manualEntry || isEditMode) && (
            <Box component="form" onSubmit={handleSubmit}>
              {/* Banner do Jogo (apenas se selecionado da API) */}
              {isEditMode && !loadingDetails && (
                <Alert icon={<EditIcon />} severity="info" sx={{ mb: 4, borderRadius: 2, fontSize: '1rem' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Modo de Edição
                  </Typography>
                  <Typography variant="body2">
                    Você está editando o jogo <strong>{formData.nome}</strong>. Altere os campos desejados e salve.
                  </Typography>
                </Alert>
              )}
              {selectedGame && formData.foto_url && (
                <Paper elevation={12} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                  <Box sx={{ position: 'relative', height: { xs: 250, sm: 350 } }}>
                    <CardMedia 
                      component="img" 
                      height="350" 
                      image={formData.foto_url} 
                      alt={formData.nome} 
                      sx={{ 
                        objectFit: 'cover', 
                        filter: 'brightness(0.7)',
                        transition: 'filter 0.3s ease'
                      }} 
                    />
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', 
                      p: 4, 
                      color: 'white' 
                    }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {formData.nome}
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        {formData.desenvolvedora} • {formData.ano_lancamento}
                      </Typography>
                    </Box>
                    <Chip
                      icon={<EditIcon />}
                      label="Todos os campos são editáveis"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: alpha('#fff', 0.9),
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Paper>
              )}

              {/* Informação sobre edição manual */}
              {manualEntry && (
                <Alert 
                  icon={<InfoIcon />} 
                  severity="info" 
                  sx={{ mb: 4, borderRadius: 2, fontSize: '1rem' }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Modo de Cadastro Manual Ativado
                  </Typography>
                  <Typography variant="body2">
                    Preencha todos os campos manualmente. Você tem controle total sobre as informações do jogo.
                  </Typography>
                </Alert>
              )}

              {/* Seção: Dados Básicos do Jogo */}
              <Paper elevation={6} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ 
                  background: GRADIENTS.dark, 
                  color: 'white', 
                  p: 3,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <GameIcon sx={{ mr: 2, fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, flexGrow: 1 }}>
                    Dados Básicos do Jogo
                  </Typography>
                  <Chip 
                    icon={<EditIcon />} 
                    label="Editável" 
                    size="small" 
                    sx={{ background: alpha('#fff', 0.2), color: 'white' }} 
                  />
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        fullWidth 
                        label="Nome do Jogo" 
                        name="nome" 
                        value={formData.nome} 
                        onChange={handleChange}
                        required
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }} 
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        fullWidth 
                        label="Ano de Lançamento" 
                        name="ano_lancamento" 
                        value={formData.ano_lancamento} 
                        onChange={handleChange}
                        type="number"
                        InputProps={{ inputProps: { min: 1970, max: new Date().getFullYear() + 5 } }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }} 
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <TextField 
                        fullWidth 
                        label="Desenvolvedora" 
                        name="desenvolvedora" 
                        value={formData.desenvolvedora} 
                        onChange={handleChange}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }} 
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <TextField 
                        fullWidth 
                        label="Publicadora" 
                        name="publicadora" 
                        value={formData.publicadora} 
                        onChange={handleChange}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }} 
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                        fullWidth 
                        label="Gênero(s)" 
                        name="genero" 
                        value={formData.genero} 
                        onChange={handleChange}
                        placeholder="Ex: Action, Adventure, RPG"
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }} 
                      />
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
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhotoIcon color="action" />
                            </InputAdornment>
                          )
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }} 
                      />
                    </Grid>
                    
                    {/* Campo de Plataforma Melhorado */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }}>
                        <InputLabel>Plataforma *</InputLabel>
                        <Select
                          name="plataforma"
                          value={formData.plataforma}
                          label="Plataforma *"
                          onChange={handlePlatformChange}
                          required
                        >
                          {platformOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PlatformIcon sx={{ mr: 1, fontSize: 20 }} />
                                {option}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    {formData.plataforma === 'Outra' && (
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Nome da Plataforma (Personalizada)"
                          value={customPlatform}
                          onChange={handleCustomPlatformChange}
                          required
                          placeholder="Digite o nome da plataforma"
                          sx={{ 
                            '& .MuiOutlinedInput-root': { 
                              borderRadius: 2,
                              backgroundColor: alpha(theme.palette.background.paper, 0.5)
                            } 
                          }}
                        />
                      </Grid>
                    )}
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }}>
                        <InputLabel>Tipo de Jogo</InputLabel>
                        <Select
                          name="tipo_jogo"
                          value={formData.tipo_jogo}
                          label="Tipo de Jogo"
                          onChange={handleChange}
                        >
                          <MenuItem value="digital">🔗 Digital</MenuItem>
                          <MenuItem value="fisica">💿 Física</MenuItem>
                          <MenuItem value="ps_plus">🎮 PS-Plus</MenuItem>
                          <MenuItem value="gratis">🆓 Grátis</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField 
                        fullWidth 
                        label="Colocação na Lista" 
                        name="colocacao" 
                        value={formData.colocacao} 
                        onChange={handleChange}
                        type="number"
                        placeholder="Posição do jogo na sua lista pessoal"
                        InputProps={{ inputProps: { min: 1 } }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }} 
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Paper>

              {/* Seção: Tempo Jogado e Avaliações */}
              <Paper elevation={6} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ 
                  background: GRADIENTS.warning, 
                  color: 'white', 
                  p: 3,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <ScheduleIcon sx={{ mr: 2, fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    Tempo Jogado e Avaliações
                  </Typography>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Tempo Jogado (Horas)"
                        name="tempo_jogado_horas"
                        type="number"
                        value={formData.tempo_jogado_horas}
                        onChange={handleChange}
                        InputProps={{ 
                          inputProps: { min: 0 },
                          startAdornment: <InputAdornment position="start">⏰</InputAdornment>
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Tempo Jogado (Minutos)"
                        name="tempo_jogado_minutos"
                        type="number"
                        value={formData.tempo_jogado_minutos}
                        onChange={handleChange}
                        InputProps={{ 
                          inputProps: { min: 0, max: 59 },
                          startAdornment: <InputAdornment position="start">⏱️</InputAdornment>
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Chip icon={<StarIcon />} label="Avaliações (0-10)" />
                      </Divider>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Nota Gameplay"
                        name="nota_gameplay"
                        type="number"
                        value={formData.nota_gameplay}
                        onChange={handleChange}
                        InputProps={{ 
                          inputProps: { min: 0, max: 10, step: 0.1 },
                          startAdornment: <InputAdornment position="start">🎮</InputAdornment>
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Nota História"
                        name="nota_historia"
                        type="number"
                        value={formData.nota_historia}
                        onChange={handleChange}
                        InputProps={{ 
                          inputProps: { min: 0, max: 10, step: 0.1 },
                          startAdornment: <InputAdornment position="start">📖</InputAdornment>
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Nota Trilha Sonora"
                        name="nota_trilha_sonora"
                        type="number"
                        value={formData.nota_trilha_sonora}
                        onChange={handleChange}
                        InputProps={{ 
                          inputProps: { min: 0, max: 10, step: 0.1 },
                          startAdornment: <InputAdornment position="start">🎵</InputAdornment>
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nota Total (Média Automática)"
                        name="nota_total"
                        value={formData.nota_total}
                        InputProps={{ 
                          readOnly: true,
                          startAdornment: <InputAdornment position="start">⭐</InputAdornment>
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.success.light, 0.1)
                          } 
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Paper>

              {/* Seção: Troféus e Conquistas */}
              <Paper elevation={6} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ 
                  background: GRADIENTS.secondary, 
                  color: 'white', 
                  p: 3,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <EmojiEventsIcon sx={{ mr: 2, fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Troféus e Conquistas
                  </Typography>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }}>
                        <InputLabel>Platinado?</InputLabel>
                        <Select
                          name="platinado"
                          value={formData.platinado}
                          label="Platinado?"
                          onChange={handleChange}
                        >
                          <MenuItem value="sim">🏆 Sim</MenuItem>
                          <MenuItem value="nao">❌ Não</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }}>
                        <InputLabel>Dificuldade da Platina</InputLabel>
                        <Select
                          name="dificuldade_platina"
                          value={formData.dificuldade_platina}
                          label="Dificuldade da Platina"
                          onChange={handleChange}
                        >
                          <MenuItem value="facil">🟢 Fácil</MenuItem>
                          <MenuItem value="medio">🟡 Médio</MenuItem>
                          <MenuItem value="dificil">🟠 Difícil</MenuItem>
                          <MenuItem value="extremamente_dificil">🔴 Extremamente Difícil</MenuItem>
                          <MenuItem value="impossivel">⚫ Impossível</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Troféus Totais"
                        name="trofeus_totais"
                        type="number"
                        value={formData.trofeus_totais}
                        onChange={handleChange}
                        InputProps={{ 
                          inputProps: { min: 0 },
                          startAdornment: <InputAdornment position="start">🏅</InputAdornment>
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Troféus Obtidos"
                        name="trofeus_obtidos"
                        type="number"
                        value={formData.trofeus_obtidos}
                        onChange={handleChange}
                        InputProps={{ 
                          inputProps: { min: 0 },
                          startAdornment: <InputAdornment position="start">✅</InputAdornment>
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Troféus Restantes (Calculado Automaticamente)"
                        name="trofeus_restantes"
                        value={formData.trofeus_restantes}
                        InputProps={{ 
                          readOnly: true,
                          startAdornment: <InputAdornment position="start">⏳</InputAdornment>
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.info.light, 0.1)
                          } 
                        }}
                      />
                    </Grid>
                    
                    {/* Barra de Progresso de Troféus */}
                    {formData.trofeus_totais > 0 && (
                      <Grid item xs={12}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Progresso de Troféus: {getProgressPercentage().toFixed(1)}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={getProgressPercentage()} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              backgroundColor: alpha(theme.palette.grey[300], 0.3),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                background: getProgressPercentage() === 100 
                                  ? GRADIENTS.success 
                                  : GRADIENTS.info
                              }
                            }} 
                          />
                        </Box>
                      </Grid>
                    )}
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Data Primeiro Troféu"
                        name="data_primeiro_trofeu"
                        type="date"
                        value={formData.data_primeiro_trofeu}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Data Último Troféu"
                        name="data_ultimo_trofeu"
                        type="date"
                        value={formData.data_ultimo_trofeu}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Dias para Platina (Calculado Automaticamente)"
                        name="dias_para_platina"
                        type="number"
                        value={formData.dias_para_platina}
                        InputProps={{ 
                          readOnly: true,
                          startAdornment: <InputAdornment position="start">📅</InputAdornment>
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.success.light, 0.1)
                          } 
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }}>
                        <InputLabel>Completude do Jogo</InputLabel>
                        <Select
                          name="completude_jogo"
                          value={formData.completude_jogo}
                          label="Completude do Jogo"
                          onChange={handleChange}
                        >
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

              {/* Seção: Configurações Adicionais */}
              <Paper elevation={6} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ 
                  background: GRADIENTS.info, 
                  color: 'white', 
                  p: 3,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <AutoAwesomeIcon sx={{ mr: 2, fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Configurações Adicionais
                  </Typography>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5) } }}>
                        <InputLabel>Idioma</InputLabel>
                        <Select
                          name="idioma"
                          value={formData.idioma}
                          label="Idioma"
                          onChange={handleChange}
                        >
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
                        <Select
                          name="status_online"
                          value={formData.status_online}
                          label="Status Online"
                          onChange={handleChange}
                        >
                          <MenuItem value="exclusivamente_offline">📱 Exclusivamente Offline</MenuItem>
                          <MenuItem value="Hibrido">🔗 Hibrido</MenuItem>
                          <MenuItem value="exclusivamente_online">☁️ Exclusivamente Online</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Troféu Mais Difícil (%)"
                        name="trofeu_mais_dificil_percentual"
                        type="number"
                        value={formData.trofeu_mais_dificil_percentual}
                        onChange={handleChange}
                        InputProps={{ 
                          inputProps: { min: 0, max: 100, step: 0.1 },
                          startAdornment: <InputAdornment position="start">💎</InputAdornment>,
                          endAdornment: <InputAdornment position="end">%</InputAdornment>
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5)
                          } 
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Paper>

              {/* Botão de Salvar Melhorado */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitStatus.status === 'submitting'}
                  sx={{
                    px: 6,
                    py: 2,
                    borderRadius: 3,
                    background: GRADIENTS.success,
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    boxShadow: theme.shadows[8],
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      transform: 'translateY(-4px) scale(1.02)', 
                      boxShadow: theme.shadows[16],
                      background: GRADIENTS.success
                    },
                    '&:active': {
                      transform: 'translateY(-2px) scale(0.98)'
                    }
                  }}
                >
                 {submitStatus.status === 'submitting' ? (
                    <>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                      {/* MUDANÇA: Texto dinâmico */}
                      {isEditMode ? 'Salvando Alterações...' : 'Salvando Jogo...'}
                    </>
                  ) : (
                    <>
                      <SaveIcon sx={{ mr: 2 }} />
                      {/* MUDANÇA: Texto dinâmico */}
                      {isEditMode ? 'Salvar Alterações' : 'Salvar Jogo na Coleção'}
                    </>
                  )}
                </Button>
              </Box>

              {/* Mensagens de Status Melhoradas */}
              <Collapse in={submitStatus.status !== 'idle'}>
                <Alert
                  severity={submitStatus.status === 'success' ? 'success' : 'error'}
                  sx={{ 
                    borderRadius: 3,
                    fontSize: '1rem',
                    '& .MuiAlert-icon': { fontSize: 28 }
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {submitStatus.status === 'success' ? '🎉 Sucesso!' : '❌ Erro!'}
                  </Typography>
                  {submitStatus.message}
                </Alert>
              </Collapse>
            </Box>
          )}
        </Collapse>
      </Box>
    </Container>
  );
}

export default CadastroJogo;

