import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Paper, LinearProgress } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import CancelIcon from '@mui/icons-material/Cancel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const TrophyCard = ({ games }) => {
    if (!games || games.length === 0) return null;

    const platinados = games.filter(g => g.platinado).length;
    const emProgresso = games.filter(g => g.progresso > 0 && !g.platinado).length;
    const trofeusObtidos = games.reduce((acc, g) => acc + (g.trofeus_obtidos || 0), 0);
    const totalTrofeus = games.reduce((acc, g) => acc + (g.trofeus_totais || 0), 0);
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
                            {/* Adicione mais cards aqui se necessário */}
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default TrophyCard;
