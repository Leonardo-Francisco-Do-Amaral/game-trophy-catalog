import React from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Stack, Tooltip, Rating, Chip, Divider, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SpeedIcon from '@mui/icons-material/Speed';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessIcon from '@mui/icons-material/Business';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import theme from '../../theme/theme';
import { formatDate, formatTotalTime } from '../../utils/formatters';

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
                    background: 'rgba(28, 28, 30, 0.85)',
                    boxShadow: '0 8px 40px 0 rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1.5px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
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
                color: 'primary.contrastText'
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
                            boxShadow: '0 0 0 4px #1c1c1e, 0 4px 24px rgba(0,0,0,0.3)',
                            border: `3px solid ${theme.palette.secondary.main}`
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

                        {/* Badges Section */}
                        <Box sx={{ width: '100%', mt: 1 }}>
                            <Typography variant="caption" sx={{ color: '#a0a0a0', fontWeight: 'bold', display: 'block', textAlign: 'center', mb: 1, textTransform: 'uppercase' }}>Badges</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                                {(() => {
                                    let tags = [];
                                    try {
                                        if (Array.isArray(game.tags)) {
                                            tags = game.tags;
                                        } else if (typeof game.tags === 'string') {
                                            if (game.tags.startsWith('[')) {
                                                tags = JSON.parse(game.tags);
                                            } else if (game.tags.includes(',')) {
                                                tags = game.tags.split(',').map(t => t.trim());
                                            } else if (game.tags) {
                                                tags = [game.tags];
                                            }
                                        }
                                    } catch (e) {
                                        tags = [];
                                    }

                                    if (tags.length === 0) return <Typography variant="caption" sx={{ color: '#666' }}>-</Typography>;

                                    return tags.map((tag, index) => {
                                        const cleanTag = tag.replace(/['"{}\\]/g, '').trim();

                                        const badgeImages = {
                                            'Estilo Anime': '/badge/Anime.png',
                                            'Brasileiro': '/badge/Brasileiro.png',
                                            'Vencedor do GOTY': '/badge/GOTY.png',
                                            'Multiplos Finais': '/badge/Finais.png',
                                            'Remaster/Remake': '/badge/Remaster.png',
                                            'Opção de Romance': '/badge/Romance.png',
                                            'Vampiro': '/badge/Vampiro.png',
                                            'Retro': '/badge/Retro.png'
                                        };

                                        const badgeImage = badgeImages[cleanTag];

                                        if (badgeImage) {
                                            return (
                                                <Tooltip key={`detail-tag-${index}`} title={cleanTag}>
                                                    <Box
                                                        component="img"
                                                        src={badgeImage}
                                                        alt={cleanTag}
                                                        sx={{
                                                            height: 32,
                                                            width: 'auto',
                                                            objectFit: 'contain',
                                                            filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.2))',
                                                        }}
                                                    />
                                                </Tooltip>
                                            );
                                        }

                                        return (
                                            <Chip
                                                key={`detail-tag-${index}`}
                                                label={cleanTag}
                                                size="small"
                                                sx={{
                                                    height: 20,
                                                    fontSize: '0.65rem',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    color: '#fff',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                                }}
                                            />
                                        );
                                    });
                                })()}
                            </Box>
                        </Box>
                    </Box>
                    {/* Dados Principais e Secundários */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                            <Chip icon={<SpeedIcon sx={{ color: '#fff !important' }} />} label={game.dificuldade_platina || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                            <Chip icon={<CalendarTodayIcon sx={{ color: '#fff !important' }} />} label={game.ano_lancamento || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                            <Chip icon={<BusinessIcon sx={{ color: '#fff !important' }} />} label={game.desenvolvedora || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                            <Chip icon={<StorefrontIcon sx={{ color: '#fff !important' }} />} label={game.publicadora || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                        </Box>
                        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.15)' }} />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                            <Chip icon={<CategoryIcon sx={{ color: '#fff !important' }} />} label={game.genero || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                            <Chip icon={<MusicNoteIcon sx={{ color: '#fff !important' }} />} label={game.idioma || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                            <Chip icon={<AccessTimeIcon sx={{ color: '#fff !important' }} />} label={totalPlayTime} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                            <Chip icon={<MilitaryTechIcon sx={{ color: '#fff !important' }} />} label={game.status_online || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                            <Chip icon={<CheckCircleIcon sx={{ color: '#fff !important' }} />} label={game.completude_jogo || '-'} sx={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                            <Chip icon={<EmojiEventsIcon sx={{ color: '#fff !important' }} />} label={`Progresso: ${game.trofeus_obtidos || 0}/${game.trofeus_totais || 0}`} sx={{ background: 'rgba(255, 171, 0, 0.2)', color: '#ffab00', fontWeight: 'bold' }} />
                        </Box>
                        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.15)' }} />
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1.5, color: 'secondary.main' }}>Linha do Tempo dos Troféus</Typography>
                            <Stack spacing={1}>
                                <Typography variant="body2" sx={{ color: '#e0e0e0' }}><b>Primeiro Troféu:</b> {formatDate(game.data_primeiro_trofeu)}</Typography>
                                <Typography variant="body2" sx={{ color: '#e0e0e0' }}><b>Último Troféu:</b> {formatDate(game.data_ultimo_trofeu)}</Typography>
                                <Typography variant="body2" sx={{ color: '#e0e0e0' }}><b>Dias para Platina:</b> {game.dias_para_platina ? `${game.dias_para_platina} dias` : '-'}</Typography>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', p: 1.5, justifyContent: 'space-between' }}>
                <Button
                    onClick={() => {
                        if (onNavigate) {
                            onNavigate('editarJogo', game.id);
                        }
                        onClose();
                    }}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                >
                    Editar Jogo
                </Button>
                <Button onClick={onClose} color="secondary" sx={{ fontWeight: 'bold' }}>Fechar</Button>
            </DialogActions>
        </Dialog >
    );
};

export default GameDetailsDialog;
