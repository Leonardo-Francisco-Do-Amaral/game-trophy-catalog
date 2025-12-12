import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, FormControl, Select, MenuItem, Paper, CircularProgress, Grid, Chip } from '@mui/material';
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PieChartIcon from '@mui/icons-material/PieChart';

// Trophy Icons Component
const TrophyIcon = ({ place, size = 40 }) => {
    const colors = {
        1: '#FFD700', // Gold
        2: '#C0C0C0', // Silver
        3: '#CD7F32'  // Bronze
    };

    return (
        <Box
            sx={{
                width: size + 10,
                height: size + 10,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(0,0,0,0.8) 0%, ${colors[place]}40 100%)`,
                border: `2px solid ${colors[place]}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 15px ${colors[place]}80`,
                mb: 1
            }}
        >
            <EmojiEventsIcon sx={{ fontSize: size, color: colors[place], filter: `drop-shadow(0 0 5px ${colors[place]})` }} />
        </Box>
    );
};

const StatsSummary = ({ games }) => {
    const totalGames = games.length;

    // Platform Stats Calculations
    const getPlatformStats = (platformName) => {
        const platformGames = games.filter(g => g.plataforma === platformName);
        const count = platformGames.length;
        const platinums = platformGames.filter(g => g.platinado).length;
        const percent = count > 0 ? Math.round((platinums / count) * 100) : 0;
        return { count, platinums, percent };
    };

    const ps4Stats = getPlatformStats('PS4');
    const ps5Stats = getPlatformStats('PS5');

    // General Stats
    const totalPlatinums = games.filter(g => g.platinado).length;
    const completionPercentage = totalGames > 0 ? ((totalPlatinums / totalGames) * 100).toFixed(0) : 0;

    const userScores = games.map(g => Number(g.nota_total)).filter(n => !isNaN(n) && n > 0);
    const avgUserScore = userScores.length ? (userScores.reduce((a, b) => a + b, 0) / userScores.length).toFixed(1) : '-';

    const metaScores = games.map(g => Number(g.metacritic)).filter(n => !isNaN(n) && n > 0);
    const avgMetaScore = metaScores.length ? Math.round(metaScores.reduce((a, b) => a + b, 0) / metaScores.length) : '-';

    return (
        <Box sx={{ mb: 8, width: '100%' }}>
            {/* Top Row: Main Counters */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <StatCard
                        label="Total Jogos"
                        value={totalGames}
                        icon={<VideogameAssetIcon sx={{ fontSize: 35, color: '#00e5ff' }} />}
                        color="#00e5ff"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        label="Platinas Totais"
                        value={totalPlatinums}
                        icon={<WorkspacePremiumIcon sx={{ fontSize: 35, color: '#e040fb' }} />}
                        color="#e040fb"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        label="Progresso Geral"
                        value={`${completionPercentage}%`}
                        icon={<PieChartIcon sx={{ fontSize: 35, color: '#00e676' }} />}
                        color="#00e676"
                    />
                </Grid>
            </Grid>

            {/* Second Row: Platforms & Scores (2x2 Grid on desktop) */}
            <Grid container spacing={3}>
                {/* PS4 */}
                <Grid item xs={12} md={6} lg={3}>
                    <PlatformCard
                        platform="PS4"
                        stats={ps4Stats}
                        color="#4453cc"
                        textColor="white"
                    />
                </Grid>

                {/* PS5 */}
                <Grid item xs={12} md={6} lg={3}>
                    <PlatformCard
                        platform="PS5"
                        stats={ps5Stats}
                        color="#ffffff"
                        textColor="#000"
                        bgGradient="linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)"
                    />
                </Grid>

                {/* User Score */}
                <Grid item xs={12} md={6} lg={3}>
                    <ScoreCard
                        label="Sua Média"
                        value={avgUserScore}
                        scale={10}
                        color="#FFD700"
                        icon={<StarIcon sx={{ fontSize: 30, color: '#FFD700' }} />}
                    />
                </Grid>

                {/* Metacritic */}
                <Grid item xs={12} md={6} lg={3}>
                    <ScoreCard
                        label="Metacritic"
                        value={avgMetaScore}
                        scale={100}
                        color="#66cc33"
                        icon={<Typography sx={{ fontSize: 24, fontWeight: '900', color: '#66cc33' }}>M</Typography>}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

const StatCard = ({ label, value, icon, color }) => (
    <Paper sx={{
        p: 3,
        height: '100%',
        bgcolor: 'rgba(20, 20, 30, 0.6)',
        border: `1px solid ${color}30`,
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        backdropFilter: 'blur(12px)',
        boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 20px ${color}05`,
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 12px 40px ${color}20, inset 0 0 30px ${color}10`,
            border: `1px solid ${color}60`,
        }
    }}>
        <Box sx={{
            p: 2,
            borderRadius: '50%',
            bgcolor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 20px ${color}20`
        }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="h3" sx={{ fontWeight: '900', color: 'white', lineHeight: 1, mb: 0.5 }}>{value}</Typography>
            <Typography variant="body2" sx={{ color: color, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 1.5 }}>{label}</Typography>
        </Box>
    </Paper>
);

const PlatformCard = ({ platform, stats, color, textColor = 'white', bgGradient }) => (
    <Paper sx={{
        p: 3,
        height: '100%',
        borderRadius: 4,
        background: bgGradient || `linear-gradient(135deg, ${color}20 0%, rgba(10,10,20,0.8) 100%)`,
        border: `1px solid ${color}40`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 10px 30px -5px ${color}20`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 15px 40px -5px ${color}40`,
        }
    }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: '900', color: textColor === 'white' ? color : 'black', opacity: 1, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                {platform}
            </Typography>
            <Box sx={{
                px: 1.5, py: 0.5,
                bgcolor: textColor === 'white' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                borderRadius: 2,
                backdropFilter: 'blur(5px)'
            }}>
                <Typography variant="caption" sx={{ fontWeight: '800', color: textColor === 'white' ? 'white' : 'black', letterSpacing: 0.5 }}>
                    {stats.count} JOGOS
                </Typography>
            </Box>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                <Box>
                    <Typography variant="caption" sx={{ color: textColor === 'white' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                        PLATINAS
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: '900', color: textColor === 'white' ? 'white' : 'black', lineHeight: 1 }}>
                        {stats.platinums}
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: textColor === 'white' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                        PROGRESSO
                    </Typography>
                    <Typography variant="h4" sx={{ color: textColor === 'white' ? 'white' : 'black', fontWeight: '900', lineHeight: 1 }}>
                        {stats.percent}%
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ width: '100%', height: 8, bgcolor: textColor === 'white' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{
                    width: `${stats.percent}%`,
                    height: '100%',
                    bgcolor: textColor === 'white' ? color : 'black',
                    borderRadius: 4,
                    transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
            </Box>
        </Box>

        {/* Background Decoration */}
        <Typography sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-15deg)',
            fontSize: 100,
            fontWeight: '900',
            color: textColor === 'white' ? color : 'black',
            opacity: 0.03,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 0
        }}>
            {platform}
        </Typography>
    </Paper>
);

const ScoreCard = ({ label, value, scale, color, icon }) => {
    const percent = value !== '-' ? (Number(value) / scale) * 100 : 0;

    return (
        <Paper sx={{
            p: 3,
            height: '100%',
            borderRadius: 4,
            bgcolor: 'rgba(20, 20, 30, 0.6)',
            border: `1px solid ${color}30`,
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 10px 30px -5px rgba(0,0,0,0.4)`,
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px)',
                border: `1px solid ${color}60`,
            }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: '50%', bgcolor: `${color}15`, display: 'flex' }}>
                    {icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: '800', color: 'white', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {label}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: '900', color: color, lineHeight: 1 }}>
                        {value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', mt: 0.5, ml: 0.5 }}>
                        de {scale}
                    </Typography>
                </Box>

                {/* Circular Progress */}
                <Box sx={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="80" height="80" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                        <circle
                            cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8"
                            strokeDasharray="283"
                            strokeDashoffset={283 - (283 * percent / 100)}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        />
                    </svg>
                    <Typography variant="caption" sx={{
                        position: 'absolute',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 12
                    }}>
                        {Math.round(percent)}%
                    </Typography>
                </Box>
            </Box>

            {/* Glow Effect */}
            <Box sx={{
                position: 'absolute',
                bottom: -50,
                right: -50,
                width: 150,
                height: 150,
                background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
                pointerEvents: 'none'
            }} />
        </Paper>
    );
};

const Podium = ({ top3 }) => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: { xs: 1, md: 4 },
            mb: 8,
            height: 450,
            width: '100%',
            perspective: '1000px'
        }}>
            {/* 2º Lugar */}
            <PodiumPlace game={top3[1]} place={2} color="#C0C0C0" height={320} delay={0.2} />
            {/* 1º Lugar */}
            <PodiumPlace game={top3[0]} place={1} color="#FFD700" height={380} delay={0} />
            {/* 3º Lugar */}
            <PodiumPlace game={top3[2]} place={3} color="#CD7F32" height={280} delay={0.4} />
        </Box>
    );
};

const PodiumPlace = ({ game, place, color, height, delay }) => {
    if (!game) {
        return (
            <Box sx={{
                width: { xs: 100, md: 240 },
                height: height,
                border: `2px dashed ${color}40`,
                borderRadius: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0.3
            }}>
                <Typography variant="h3" sx={{ color }}>{place}º</Typography>
            </Box>
        );
    }

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay, duration: 0.6, type: 'spring' }}
            sx={{
                width: { xs: 110, md: 260 },
                height: height,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                zIndex: place === 1 ? 10 : 1
            }}
        >
            <TrophyIcon place={place} size={place === 1 ? 50 : 35} />

            <Paper
                elevation={24}
                sx={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${game.foto_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 4,
                    border: `3px solid ${color}`,
                    boxShadow: `0 0 30px ${color}60, 0 10px 20px rgba(0,0,0,0.5)`,
                    cursor: 'grab',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                        transform: 'translateY(-10px) scale(1.02)',
                        boxShadow: `0 0 50px ${color}80, 0 20px 40px rgba(0,0,0,0.6)`
                    }
                }}
            >
                <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0))',
                    pt: 8,
                    pb: 2,
                    px: 2,
                    textAlign: 'center',
                }}>
                    <Typography variant="h6" sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: `0 0 10px ${color}`,
                        lineHeight: 1.2
                    }}>
                        {game.nome}
                    </Typography>
                    <Typography variant="caption" sx={{ color: color, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                        {place === 1 ? 'GOTY' : place === 2 ? 'Vice-Campeão' : 'Bronze'}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

const RankingPage = () => {
    const [year, setYear] = useState(2017);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const fetchGames = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/api/jogos/ano/${year}`);
            if (!response.ok) throw new Error('Falha na resposta da API');
            const data = await response.json();
            setGames(data);
        } catch (error) {
            console.error('Erro ao buscar jogos:', error);
            enqueueSnackbar('Erro ao carregar jogos. Verifique se o backend está rodando.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, [year]);

    const handleReorder = (newOrder) => {
        setGames(newOrder);
        saveRanking(newOrder);
    };

    const saveRanking = async (updatedGames) => {
        const rankings = updatedGames.map((game, index) => ({
            id: game.id,
            colocacao: index + 1
        }));

        try {
            await fetch('http://localhost:3001/api/jogos/ranking', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rankings })
            });
        } catch (error) {
            console.error('Erro ao salvar ranking:', error);
        }
    };

    const top3 = games.slice(0, 3);

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100%',
            background: 'radial-gradient(circle at 50% 20%, #1a1d29 0%, #0d0e12 100%)',
            pb: 10,
            pt: 4
        }}>
            <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>

                {/* Header Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                    <Box>
                        <Typography variant="h2" sx={{
                            fontWeight: '900',
                            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                            backgroundClip: 'text',
                            textFillColor: 'transparent',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))',
                            letterSpacing: -1
                        }}>
                            GOTY RANKING
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: 'text.secondary', ml: 0.5 }}>
                            Seus melhores momentos de {year}
                        </Typography>
                    </Box>

                    <FormControl sx={{ minWidth: 150 }}>
                        <Select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                borderRadius: 3,
                                border: '1px solid rgba(255,255,255,0.1)',
                                '& .MuiSvgIcon-root': { color: 'white' },
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: '#1a1d29',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }
                                }
                            }}
                        >
                            {[2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                                <MenuItem key={y} value={y}>{y}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                        <CircularProgress size={60} thickness={4} sx={{ color: '#FFD700' }} />
                    </Box>
                ) : (
                    <>
                        {/* Stats Summary */}
                        {games.length > 0 && <StatsSummary games={games} />}

                        {/* Podium (Top 3) */}
                        {games.length > 0 && (
                            <Podium top3={top3} />
                        )}

                        {/* Drag & Drop List */}
                        <Box sx={{ width: '100%', mt: 8, px: { xs: 2, md: 4 } }}>
                            <Typography variant="h4" sx={{ mb: 4, color: 'white', fontWeight: '900', textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
                                CLASSIFICAÇÃO GERAL
                            </Typography>

                            <Reorder.Group axis="y" values={games} onReorder={handleReorder}>
                                {games.map((game, index) => (
                                    <Reorder.Item key={game.id} value={game} style={{ listStyle: 'none' }}>
                                        <Paper
                                            component={motion.div}
                                            whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                            sx={{
                                                p: 2,
                                                mb: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 3,
                                                cursor: 'grab',
                                                bgcolor: index < 3 ? `rgba(${index === 0 ? '255, 215, 0' : index === 1 ? '192, 192, 192' : '205, 127, 50'}, 0.05)` : 'rgba(255,255,255,0.03)',
                                                border: index < 3 ? `1px solid rgba(${index === 0 ? '255, 215, 0' : index === 1 ? '192, 192, 192' : '205, 127, 50'}, 0.3)` : '1px solid rgba(255,255,255,0.05)',
                                                borderRadius: 3,
                                                backdropFilter: 'blur(10px)',
                                                transition: 'background-color 0.2s',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {/* Rank Number */}
                                            <Box sx={{
                                                width: 60,
                                                height: 60,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '50%',
                                                bgcolor: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                <Typography variant="h4" sx={{
                                                    fontWeight: 'bold',
                                                    color: index < 3 ? (index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32') : 'text.secondary'
                                                }}>
                                                    {index + 1}
                                                </Typography>
                                            </Box>

                                            {/* Game Image */}
                                            <Box
                                                component="img"
                                                src={game.foto_url}
                                                alt={game.nome}
                                                sx={{
                                                    width: 120,
                                                    height: 70,
                                                    objectFit: 'cover',
                                                    borderRadius: 2,
                                                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                                }}
                                            />

                                            {/* Game Info */}
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                                    {game.nome}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 3, mt: 0.5, alignItems: 'center' }}>
                                                    {/* Custom Platform Tag */}
                                                    <Box sx={{
                                                        px: 1.5, py: 0.5,
                                                        borderRadius: '4px',
                                                        bgcolor: game.plataforma === 'PS5' ? 'rgba(255, 255, 255, 0.9)' :
                                                            game.plataforma === 'PS4' ? 'rgba(40, 50, 200, 0.2)' : 'rgba(255,255,255,0.1)',
                                                        border: `1px solid ${game.plataforma === 'PS5' ? '#fff' : game.plataforma === 'PS4' ? '#4453cc' : 'rgba(255,255,255,0.2)'}`,
                                                        boxShadow: game.plataforma === 'PS5' ? '0 0 10px rgba(255,255,255,0.3)' :
                                                            game.plataforma === 'PS4' ? '0 0 10px rgba(68, 83, 204, 0.3)' : 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <Typography variant="caption" sx={{
                                                            fontWeight: '900',
                                                            color: game.plataforma === 'PS5' ? '#000' :
                                                                game.plataforma === 'PS4' ? '#8899ff' : 'white',
                                                            letterSpacing: 1,
                                                            lineHeight: 1
                                                        }}>
                                                            {game.plataforma || 'N/A'}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <StarIcon sx={{ fontSize: 16, color: '#FFD700' }} />
                                                        <Typography variant="body2" sx={{ color: '#e0e0e0', fontWeight: 'bold' }}>
                                                            {game.nota_total || '-'}
                                                        </Typography>
                                                    </Box>

                                                    {game.metacritic && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Box component="span" sx={{
                                                                width: 20,
                                                                height: 20,
                                                                bgcolor: game.metacritic >= 75 ? '#66cc33' : game.metacritic >= 50 ? '#ffcc33' : '#ff0000',
                                                                color: 'black',
                                                                borderRadius: '4px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: 12,
                                                                fontWeight: 'bold'
                                                            }}>
                                                                M
                                                            </Box>
                                                            <Typography variant="body2" sx={{ color: '#e0e0e0', fontWeight: 'bold' }}>
                                                                {game.metacritic}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Box>

                                            {/* Drag Handle Icon (Visual only) */}
                                            <Box sx={{ color: 'rgba(255,255,255,0.2)', mr: 2 }}>
                                                :::
                                            </Box>
                                        </Paper>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        </Box>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default RankingPage;
