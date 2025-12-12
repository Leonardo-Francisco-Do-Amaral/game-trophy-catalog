import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Chip, Tooltip, Rating, LinearProgress, Divider, Stack, CircularProgress, SvgIcon } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessIcon from '@mui/icons-material/Business';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SpeedIcon from '@mui/icons-material/Speed';
import CategoryIcon from '@mui/icons-material/Category';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CloseIcon from '@mui/icons-material/Close';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import theme from '../../theme/theme';
import { formatTotalTime, normPlatform } from '../../utils/formatters';
import { BADGE_CATEGORIES, LEGACY_BADGE_MAP } from '../../utils/badges';


const GameCard = ({ game, onClick }) => {
    const [showBadges, setShowBadges] = useState(false);
    // Fix isCompleted logic to handle API response structure
    const isCompleted = game.platinado || game.completude_jogo === 'Platinado' || game.completude_jogo === '100%';
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

    // Calculate Score for Max Score Effect
    let media = 0;
    if (typeof game.nota_total === 'number') {
        media = game.nota_total;
    } else {
        const notas = [game.nota_gameplay, game.nota_historia, game.nota_trilha_sonora].filter(n => typeof n === 'number');
        media = notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : 0;
    }
    const isMaxScore = media === 10;


    // Tilt 3D Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;
        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const baseCardStyle = {
        background: 'linear-gradient(145deg, rgba(42, 45, 52, 0.8) 0%, rgba(28, 30, 34, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        backdropFilter: 'blur(8px)',
    };

    const fisicoBoxStyle = isFisico ? {
        border: '2px solid #1565c0',
        boxShadow: '0 0 15px rgba(21, 101, 192, 0.5)',
        background: '#1f232b',
        position: 'relative',
        overflow: 'hidden',
    } : {};

    // Special Effects Styles
    const impossibleStyle = isImpossible ? {
        border: `2px solid ${theme.palette.error.main}`,
        boxShadow: `0 0 15px ${theme.palette.error.main}66`,
    } : {};

    // Max Score - Removed border effect, now handled in Rating component
    const maxScoreStyle = {};

    // Soulslike Effect - Extremely Hard Games
    const isExtremelyHard = typeof game.dificuldade_platina === 'string' &&
        game.dificuldade_platina
            .normalize('NFD')
            .replace(/[ - ]/g, '')
            .replace(/\u0300-\u036f/g, '')
            .toLowerCase()
            .trim() === 'extremamentedificil';

    // Multi-Tag Logic
    let tags = [];
    try {
        if (Array.isArray(game.tags)) {
            tags = game.tags;
        } else if (typeof game.tags === 'string') {
            // Handle both JSON array string and legacy single string
            if (game.tags.startsWith('[')) {
                tags = JSON.parse(game.tags);
            } else if (game.tags.includes(',')) {
                // Handle comma-separated string
                tags = game.tags.split(',').map(t => t.trim());
            } else if (game.tags) {
                tags = [game.tags];
            }
        }
    } catch (e) {
        console.error("Error parsing tags:", e);
        tags = [];
    }



    const magmaNeonStyle = isExtremelyHard ? {
        border: '2px solid #ff3d00',
        boxShadow: '0 0 15px rgba(255, 61, 0, 0.5)',
        background: baseCardStyle.background, // Override physical background with standard gradient
    } : {};

    // COMPLETION TIERS LOGIC
    const completude = (game.completude_jogo || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/_/g, " ").trim();
    const isTrueMaster = completude === 'platinado com dlc';
    const is100Percent = completude === '100%';
    // const isBasePlatinum = game.platinado && !isTrueMaster; // Not used for tags, but good to know

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
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }
    } : null;

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <Card
                onClick={onClick}
                sx={{
                    ...baseCardStyle,
                    width: '100%',
                    minWidth: 280,
                    maxWidth: 320,
                    height: 550, // Fixed height for uniformity
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderRadius: '18px',
                    alignSelf: 'stretch',
                    position: 'relative',
                    overflow: 'hidden',
                    // Default border logic
                    border: isCompleted ? `2px solid ${theme.palette.secondary.main}` : '1px solid rgba(255, 255, 255, 0.1)',

                    // Apply Special Effects
                    // Apply Special Effects
                    ...fisicoBoxStyle, // Base Physical Look
                    ...impossibleStyle, // Overrides Border if Impossible
                    ...magmaNeonStyle, // Overrides Border if Extremely Hard
                    // Removed primaryStyle application to fix border issue
                    ...maxScoreStyle,

                    '&:hover': {
                        boxShadow: isImpossible
                            ? `0 0 20px ${theme.palette.error.main}aa`
                            : isExtremelyHard
                                ? '0 0 40px rgba(255, 61, 0, 0.6), 0 0 80px rgba(255, 145, 0, 0.4)' // Intense Fire Glow
                                : isFisico
                                    ? '0 0 30px rgba(21, 101, 192, 0.6)'
                                    : isCompleted
                                        ? `0 0 30px ${theme.palette.secondary.main}66`
                                        : '0 15px 40px rgba(0,0,0,0.6)',

                        // BALANCED MODE - Glitch Effect on Hover for Impossible Games
                        ...(isImpossible && {
                            animation: 'glitch-skew 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite', // Slower, subtle shake
                            filter: 'invert(1) hue-rotate(180deg)', // Negative effect
                            '& .game-cover': {
                                filter: 'contrast(1.2) brightness(1.1)', // Slight boost
                            },
                            // Noise Overlay - Subtle
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'url(/glitch-noise.png)',
                                backgroundSize: 'cover',
                                opacity: 0.15, // Very subtle texture
                                mixBlendMode: 'screen',
                                animation: 'noise-flash 0.5s infinite steps(2, start)',
                                zIndex: 5,
                                pointerEvents: 'none',
                            }
                        }),

                        // MAGMA & NEON - For Extremely Hard Games
                        ...(isExtremelyHard && {
                            transform: 'translateY(-5px) scale(1.02)',
                            '& .game-cover': {
                                filter: 'sepia(0.5) saturate(2) contrast(1.2)', // Hot/Burning look
                                transition: 'filter 0.5s ease',
                            },
                            // Neon Circulating Tag Border
                            '& .difficulty-chip': {
                                position: 'relative',
                                background: '#000', // Black background
                                color: '#fff', // White text
                                overflow: 'hidden',
                                border: 'none', // Remove default border
                                boxShadow: '0 0 10px rgba(255, 23, 68, 0.5)', // Subtle glow
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '-50%',
                                    left: '-50%',
                                    width: '200%',
                                    height: '200%',
                                    background: 'conic-gradient(transparent, transparent, #ff1744, #d50000, #ff1744, transparent, transparent)', // Neon Red Gradient
                                    animation: 'spin 1.5s linear infinite',
                                    zIndex: 0,
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: '2px', // Inner spacing for the border width
                                    background: '#000', // Match chip background
                                    borderRadius: 'inherit',
                                    zIndex: 0,
                                },
                                '& .MuiChip-label, & .MuiChip-icon': {
                                    position: 'relative',
                                    zIndex: 1, // Keep text above the spinning border
                                }
                            },
                            // Falling Magma Drops (Downwards) - More Particles
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '-100%',
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: `
            radial-gradient(2px 10px at 10% 20%, #ff1744, transparent),
            radial-gradient(2px 10px at 20% 50%, #ff9100, transparent),
            radial-gradient(2px 10px at 30% 30%, #ff1744, transparent),
            radial-gradient(2px 10px at 50% 70%, #ff9100, transparent),
            radial-gradient(2px 10px at 60% 40%, #ff1744, transparent),
            radial-gradient(2px 10px at 80% 60%, #ff9100, transparent),
            radial-gradient(2px 10px at 90% 20%, #ff1744, transparent)
            `,
                                backgroundSize: '100% 100%',
                                animation: 'magma-drip 1.5s infinite linear', // Slightly faster
                                opacity: 0.9,
                                zIndex: 5,
                                pointerEvents: 'none',
                            },
                            // Rising Embers (Upwards - to keep the fire feel)
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-100%',
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: 'radial-gradient(2px 2px at 10% 80%, #ffeb3b, transparent), radial-gradient(2px 2px at 30% 90%, #ff5722, transparent), radial-gradient(2px 2px at 70% 85%, #ffeb3b, transparent)',
                                backgroundSize: '100% 100%',
                                animation: 'ember-rise 3s infinite linear',
                                opacity: 0.6,
                                zIndex: 4,
                                pointerEvents: 'none',
                            }
                        }),

                        // MAGMA & NEON - For Extremely Hard Games
                        ...(isExtremelyHard && {
                            transform: 'translateY(-5px) scale(1.02)',
                            '& .game-cover': {
                                filter: 'sepia(0.5) saturate(2) contrast(1.2)', // Hot/Burning look
                                transition: 'filter 0.5s ease',
                            },
                            // Neon Circulating Tag Border
                            '& .difficulty-chip': {
                                position: 'relative',
                                background: '#000', // Black background
                                color: '#fff', // White text
                                overflow: 'hidden',
                                border: 'none', // Remove default border
                                boxShadow: '0 0 10px rgba(255, 23, 68, 0.5)', // Subtle glow
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '-50%',
                                    left: '-50%',
                                    width: '200%',
                                    height: '200%',
                                    background: 'conic-gradient(transparent, transparent, #ff1744, #d50000, #ff1744, transparent, transparent)', // Neon Red Gradient
                                    animation: 'spin 1.5s linear infinite',
                                    zIndex: 0,
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: '2px', // Inner spacing for the border width
                                    background: '#000', // Match chip background
                                    borderRadius: 'inherit',
                                    zIndex: 0,
                                },
                                '& .MuiChip-label, & .MuiChip-icon': {
                                    position: 'relative',
                                    zIndex: 1, // Keep text above the spinning border
                                }
                            },
                            // Falling Magma Drops (Downwards) - More Particles
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '-100%',
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: `
            radial-gradient(2px 10px at 10% 20%, #ff1744, transparent),
            radial-gradient(2px 10px at 20% 50%, #ff9100, transparent),
            radial-gradient(2px 10px at 30% 30%, #ff1744, transparent),
            radial-gradient(2px 10px at 50% 70%, #ff9100, transparent),
            radial-gradient(2px 10px at 60% 40%, #ff1744, transparent),
            radial-gradient(2px 10px at 80% 60%, #ff9100, transparent),
            radial-gradient(2px 10px at 90% 20%, #ff1744, transparent)
            `,
                                backgroundSize: '100% 100%',
                                animation: 'magma-drip 1.5s infinite linear', // Slightly faster
                                opacity: 0.9,
                                zIndex: 5,
                                pointerEvents: 'none',
                            },
                            // Rising Embers (Upwards - to keep the fire feel)
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-100%',
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: 'radial-gradient(2px 2px at 10% 80%, #ffeb3b, transparent), radial-gradient(2px 2px at 30% 90%, #ff5722, transparent), radial-gradient(2px 2px at 70% 85%, #ffeb3b, transparent)',
                                backgroundSize: '100% 100%',
                                animation: 'ember-rise 3s infinite linear',
                                opacity: 0.6,
                                zIndex: 4,
                                pointerEvents: 'none',
                            }
                        }),

                        // Shimmer for non-impossible AND non-magma games
                        ...(!isImpossible && !isExtremelyHard && {
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '50%',
                                height: '100%',
                                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
                                transform: 'skewX(-25deg)',
                                animation: 'shimmer 1.5s infinite',
                            }
                        }),

                        // Max Score Star Animation Trigger
                        ...(isMaxScore && {
                            '& .MuiRating-icon': {
                                animation: 'star-spin 0.6s ease-in-out forwards',
                                filter: 'drop-shadow(0 0 8px #FFD700)',
                                color: '#FFD700',
                            }
                        }),

                        // Vertical Neon Tags Hover Effect - Strong Blue Neon & Spinning Border
                        '& .completion-tag': {
                            color: '#00e5ff',
                            textShadow: '0 0 10px #00e5ff, 0 0 20px #00e5ff, 0 0 40px #00e5ff',
                            boxShadow: '0 0 20px rgba(0, 229, 255, 0.8), inset 0 0 15px rgba(0, 229, 255, 0.5)',
                            transform: 'scale(1.05) translateX(-2px)',
                            // Reveal the spinning border and mask on hover
                            '&::before': { opacity: 1 },
                            '&::after': { opacity: 1 },
                        },
                    },
                    '@keyframes spin-slow': {
                        '0%': { transform: 'scale(1.5) rotate(0deg)' },
                        '100%': { transform: 'scale(1.5) rotate(360deg)' }
                    },
                    '@keyframes shimmer': {
                        '100%': { left: '200%' }
                    },
                    // Glitch Animations - Subtle Movement
                    '@keyframes glitch-skew': {
                        '0%': { transform: 'skew(0deg)' },
                        '20%': { transform: 'skew(-1deg)' },
                        '40%': { transform: 'skew(1deg)' },
                        '60%': { transform: 'skew(-0.5deg)' },
                        '80%': { transform: 'skew(0.5deg)' },
                        '100%': { transform: 'skew(0deg)' },
                    },
                    '@keyframes noise-flash': {
                        '0%': { opacity: 0.1 },
                        '50%': { opacity: 0.2 },
                        '100%': { opacity: 0.1 },
                    },
                    // Magma & Neon Animations
                    '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                    },
                    '@keyframes magma-drip': {
                        '0%': { transform: 'translateY(0)', opacity: 0 },
                        '20%': { opacity: 1 },
                        '100%': { transform: 'translateY(200%)', opacity: 0 },
                    },
                    '@keyframes ember-rise': {
                        '0%': { transform: 'translateY(0)', opacity: 1 },
                        '100%': { transform: 'translateY(-150%)', opacity: 0 },
                    },
                    // Star Spin Keyframes
                    '@keyframes star-spin': {
                        '0%': { transform: 'scale(1) rotate(0deg)' },
                        '50%': { transform: 'scale(1.5) rotate(180deg)' },
                        '100%': { transform: 'scale(1.2) rotate(360deg)' },
                    },
                    '@keyframes pulse-neon': {
                        '0%, 100%': { boxShadow: '0 0 15px rgba(0, 229, 255, 0.4), inset 0 0 10px rgba(0, 229, 255, 0.2)', textShadow: '0 0 8px rgba(0, 229, 255, 0.8)' },
                        '50%': { boxShadow: '0 0 25px rgba(0, 229, 255, 0.7), inset 0 0 15px rgba(0, 229, 255, 0.4)', textShadow: '0 0 12px rgba(0, 229, 255, 1)' },
                    }
                }}
            >
                {fisicoLogo}
                {platformLabel && (
                    <Box sx={platformLabel.sx}>{platformLabel.label}</Box>
                )}

                {isImpossible && (
                    <Box component="img" src="/efeito-vidro.png" alt="Efeito de vidro quebrado" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', zIndex: 3, opacity: 0.6, mixBlendMode: 'overlay' }} />
                )}

                {/* Anime Badge Image */}


                {/* Multi-Tag Badges Stack */}


                {/* Vertical Neon Tags */}
                {isTrueMaster && (
                    <Box
                        className="completion-tag"
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: '140px', // Below the header image area
                            transform: 'translateY(0)',
                            writingMode: 'vertical-rl',
                            textOrientation: 'mixed',
                            padding: '12px 4px',
                            // Default Static Style
                            background: 'rgba(10, 10, 10, 0.9)',
                            borderLeft: '2px solid #00e5ff',
                            borderTop: '1px solid rgba(0, 229, 255, 0.3)',
                            borderBottom: '1px solid rgba(0, 229, 255, 0.3)',
                            borderTopLeftRadius: '12px',
                            borderBottomLeftRadius: '12px',
                            boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)',

                            color: '#00e5ff',
                            fontWeight: '900',
                            fontSize: '0.7rem',
                            zIndex: 5,
                            letterSpacing: '3px',
                            textShadow: '0 0 8px rgba(0, 229, 255, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease-in-out',
                            overflow: 'hidden',

                            // Spinning Border (Hidden by default)
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'conic-gradient(transparent, transparent, #00e5ff, #00b8d4, #00e5ff, transparent, transparent)',
                                animation: 'spin 4s linear infinite',
                                zIndex: 0,
                                opacity: 0, // Hidden
                                transition: 'opacity 0.3s ease-in-out',
                            },

                            // Inner Mask (Hidden by default)
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                inset: '2px', // Border width
                                background: 'rgba(10, 10, 10, 0.95)',
                                borderRadius: 'inherit',
                                zIndex: 0,
                                opacity: 0, // Hidden
                                transition: 'opacity 0.3s ease-in-out',
                            },
                        }}
                    >
                        <Box component="span" sx={{ position: 'relative', zIndex: 1 }}>DLC</Box>
                    </Box>
                )}

                {is100Percent && (
                    <Box
                        className="completion-tag"
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: '140px',
                            transform: 'translateY(0)',
                            writingMode: 'vertical-rl',
                            textOrientation: 'mixed',
                            padding: '12px 4px',

                            // Default Static Style
                            background: 'rgba(10, 10, 10, 0.9)',
                            borderLeft: '2px solid #e0e0e0', // Silver
                            borderTop: '1px solid rgba(224, 224, 224, 0.3)',
                            borderBottom: '1px solid rgba(224, 224, 224, 0.3)',
                            borderTopLeftRadius: '12px',
                            borderBottomLeftRadius: '12px',
                            boxShadow: '0 0 15px rgba(224, 224, 224, 0.4)',

                            color: '#e0e0e0',
                            fontWeight: '900',
                            fontSize: '0.7rem',
                            zIndex: 5,
                            letterSpacing: '3px',
                            textShadow: '0 0 8px rgba(224, 224, 224, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease-in-out',
                            overflow: 'hidden',

                            // Spinning Border (Hidden by default)
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'conic-gradient(transparent, transparent, #00e5ff, #00b8d4, #00e5ff, transparent, transparent)', // Blue Neon on Hover
                                animation: 'spin 4s linear infinite',
                                zIndex: 0,
                                opacity: 0, // Hidden
                                transition: 'opacity 0.3s ease-in-out',
                            },

                            // Inner Mask (Hidden by default)
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                inset: '2px',
                                background: 'rgba(10, 10, 10, 0.95)',
                                borderRadius: 'inherit',
                                zIndex: 0,
                                opacity: 0, // Hidden
                                transition: 'opacity 0.3s ease-in-out',
                            },
                        }}
                    >
                        <Box component="span" sx={{ position: 'relative', zIndex: 1 }}>100%</Box>
                    </Box>
                )}

                <Box sx={{ position: 'relative', overflow: 'hidden', height: isFisico ? 180 : 160, borderTopLeftRadius: isFisico ? 0 : 18, borderTopRightRadius: isFisico ? 0 : 18, mt: isFisico ? '38px' : 0 }}>
                    <CardMedia
                        component="img"
                        height={isFisico ? 180 : 160}
                        image={game.foto_url || `https://placehold.co/340x160/d32f2f/fff?text=${encodeURIComponent(game.nome?.substring(0, 2).toUpperCase() || '??')}`}
                        alt={game.nome}
                        className="game-cover"
                        sx={{ transition: 'transform 0.5s cubic-bezier(.4,2,.3,1), filter 0.3s', objectFit: 'cover', filter: 'brightness(0.9)', borderTopLeftRadius: isFisico ? 0 : 18, borderTopRightRadius: isFisico ? 0 : 18, width: '100%', height: '100%', display: 'block' }}
                    />

                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            display: 'flex',
                            gap: 1,
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
                                    background: 'rgba(0, 0, 0, 0.7)',
                                    backdropFilter: 'blur(4px)',
                                    color: theme.palette.primary.main,
                                    border: `1px solid ${theme.palette.primary.main}`,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                    '& .MuiChip-label': { px: 1 }
                                }}
                            />
                        )}

                        {game.platinado && (
                            <Tooltip title="Platinado">
                                <Box
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        background: 'radial-gradient(circle, rgba(40,40,40,0.9) 0%, rgba(10,10,10,0.95) 100%)',
                                        borderRadius: '50%',
                                        border: '2px solid #FFD700',
                                        boxShadow: '0 0 15px #FFD70066',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        p: 0,
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src="/trofeu.png"
                                        alt="Troféu Platinado"
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            objectFit: 'contain',
                                            filter: 'drop-shadow(0 0 5px #FFD700)',
                                            opacity: 1,
                                        }}
                                    />
                                </Box>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: 220, height: '100%', boxSizing: 'border-box', overflow: 'hidden', zIndex: 2 }}>
                    <Typography variant="h6" component="h3" align="center" sx={{
                        fontWeight: 'bold', fontSize: '1.1rem', lineHeight: 1.2,
                        height: '2.7rem', // Fixed height for 2 lines
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', mb: 1,
                        color: isImpossible ? 'error.main' : isMaxScore ? '#FFD700' : '#ffffff',
                        textShadow: isMaxScore ? '0 0 10px rgba(255, 215, 0, 0.5)' : '0 2px 4px rgba(0,0,0,0.5)',
                        letterSpacing: 0.5,
                        position: 'relative',
                        zIndex: 10
                    }}>
                        {game.nome || 'Nome Indisponível'}
                    </Typography>
                    {(() => {
                        if (media === 0) return null;

                        const estrelas = +(media).toFixed(2);
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
                                                // Filter and animation handled in parent hover state for Max Score
                                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            },
                                        }}
                                    />
                                    <Typography variant="caption" sx={{ color: isMaxima ? '#FFD700' : '#e0e0e0', fontWeight: isMaxima ? 'bold' : 500, mt: 0.5, textShadow: isMaxima ? '0 0 10px #FFD700' : undefined }}>
                                        {isMaxima ? 'Nota Máxima!' : `${media.toFixed(1)}/10`}
                                    </Typography>
                                </Box>
                            </Tooltip>
                        );
                    })()}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, px: 1 }}>
                        {game.metacritic ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }}>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress
                                        variant="determinate"
                                        value={game.metacritic}
                                        size={36}
                                        thickness={4}
                                        sx={{
                                            color: game.metacritic >= 75 ? '#66cc33' : game.metacritic >= 50 ? '#ffcc33' : '#ff0000',
                                            filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))',
                                            '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            component="div"
                                            sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.8rem', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                                        >
                                            {game.metacritic}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="caption" sx={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 500, letterSpacing: 0.5 }}>METACRITIC</Typography>
                            </Box>
                        ) : <Box />}

                        {/* Creative Badges Button - Neon Style */}
                        <Tooltip title="Ver Conquistas e Badges">
                            <motion.button
                                whileHover={{ scale: 1.1, boxShadow: '0 0 20px #00fff2, inset 0 0 10px #00fff2' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowBadges(true);
                                }}
                                style={{
                                    background: 'rgba(0, 0, 0, 0.6)',
                                    border: '2px solid #00fff2',
                                    borderRadius: '50%',
                                    width: 40,
                                    height: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 0 10px #00fff2',
                                    zIndex: 20,
                                    backdropFilter: 'blur(4px)',
                                    position: 'relative' // Ensure relative positioning for the count badge
                                }}
                            >
                                <EmojiEventsIcon sx={{ color: '#00fff2', fontSize: 24, filter: 'drop-shadow(0 0 5px #00fff2)' }} />
                                {tags.length > 0 && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -5,
                                            right: -5,
                                            background: '#ff0055',
                                            color: '#fff',
                                            borderRadius: '50%',
                                            width: 18,
                                            height: 18,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                            border: '1px solid #fff'
                                        }}
                                    >
                                        {tags.length}
                                    </Box>
                                )}
                            </motion.button>
                        </Tooltip>
                    </Box>
                    <Box sx={{ minHeight: 40, maxHeight: 110, overflowY: 'auto', my: 1, pr: '4px', '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { background: '#444', borderRadius: '2px' } }}>
                        <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1} sx={{ width: '100%', alignItems: 'center', rowGap: 1, columnGap: 1, overflow: 'visible', justifyContent: 'flex-start' }}>
                            <Chip
                                className="difficulty-chip" // Added class for hover targeting
                                icon={<SpeedIcon sx={{ color: isImpossible ? 'inherit' : '#e0e0e0 !important' }} />}
                                label={game.dificuldade_platina}
                                size="small"
                                variant="filled"
                                color={isImpossible ? 'error' : 'default'}
                                sx={{
                                    background: isImpossible ? undefined : 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#e0e0e0',
                                    fontWeight: isImpossible ? 'bold' : 'normal',
                                    transition: 'all 0.3s ease' // Smooth transition for hover effect
                                }}
                            />
                            {game.tipo_jogo && <Chip icon={<CategoryIcon sx={{ color: '#e0e0e0 !important' }} />} label={game.tipo_jogo} size="small" sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e0e0e0' }} />}
                            {game.ano_lancamento && <Chip icon={<CalendarTodayIcon sx={{ color: '#e0e0e0 !important' }} />} label={game.ano_lancamento} size="small" sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e0e0e0' }} />}
                            {genres.map((genre, index) => (<Chip key={`genre-${index}`} label={genre} size="small" sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e0e0e0' }} />))}

                            {/* Special Tags moved to Overlay */}
                        </Stack>
                    </Box>
                    <Box sx={{ mt: 'auto', width: '100%' }}>
                        <Box sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="body2" color="#a0a0a0" sx={{ fontSize: '0.75rem' }}>Progresso</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#fff' }}>{game.trofeus_obtidos || 0}/{game.trofeus_totais || 0}</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={game.progresso || 0} color={game.platinado ? 'secondary' : isImpossible ? 'error' : 'secondary'} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.05)' }} />
                        </Box>
                        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
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

                {/* Badges Overlay */}
                <AnimatePresence>
                    {showBadges && (
                        <motion.div
                            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'rgba(0, 0, 0, 0.90)', // Darker background for contrast
                                zIndex: 50,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-start', // Start from top
                                padding: '20px',
                                boxSizing: 'border-box',
                                overflowY: 'auto' // Allow scrolling if many badges
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowBadges(false);
                            }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowBadges(false);
                                }}
                                style={{
                                    position: 'absolute',
                                    top: 15,
                                    right: 15,
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: 32,
                                    height: 32,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#fff',
                                    zIndex: 60
                                }}
                            >
                                <CloseIcon fontSize="small" />
                            </motion.button>

                            <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, mt: 1, fontWeight: 'bold', textShadow: '0 0 10px rgba(255, 215, 0, 0.5)', flexShrink: 0 }}>
                                Badges & Conquistas
                            </Typography>

                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {(() => {
                                    const categoriesToRender = Object.entries(BADGE_CATEGORIES).map(([categoryName, categoryData]) => {
                                        const gameBadges = categoryData.badges.filter(badge => {
                                            return tags.some(t => {
                                                const cleanTag = t.replace(/['"{}\\]/g, '').trim();
                                                return cleanTag === badge.id || LEGACY_BADGE_MAP[cleanTag] === badge.id;
                                            });
                                        });
                                        return { name: categoryName, badges: gameBadges };
                                    }).filter(cat => cat.badges.length > 0);

                                    if (categoriesToRender.length === 0) {
                                        return (
                                            <Typography variant="body2" sx={{ color: '#aaa', textAlign: 'center', mt: 4 }}>
                                                Nenhuma badge especial.
                                            </Typography>
                                        );
                                    }

                                    return categoriesToRender.map((cat, catIndex) => (
                                        <Box key={cat.name} sx={{ width: '100%' }}>
                                            <Typography variant="caption" sx={{
                                                color: '#00fff2',
                                                fontWeight: 'bold',
                                                borderBottom: '1px solid rgba(0, 255, 242, 0.3)',
                                                pb: 0.5,
                                                mb: 1.5,
                                                display: 'block',
                                                textTransform: 'uppercase',
                                                fontSize: '0.75rem'
                                            }}>
                                                {cat.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                                                {cat.badges.map((badge, badgeIndex) => (
                                                    <motion.div
                                                        key={`${badge.id}-${badgeIndex}`}
                                                        initial={{ scale: 0, y: 10 }}
                                                        animate={{ scale: 1, y: 0 }}
                                                        transition={{ delay: badgeIndex * 0.05 + catIndex * 0.1, type: 'spring', stiffness: 200 }}
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            width: 80 // Fixed width for alignment
                                                        }}
                                                    >
                                                        <Box
                                                            component="img"
                                                            src={badge.img}
                                                            alt={badge.label}
                                                            sx={{
                                                                height: 40, // Smaller image as requested
                                                                width: 'auto',
                                                                objectFit: 'contain',
                                                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                                                                mb: 0.5,
                                                                transition: 'transform 0.2s',
                                                                '&:hover': { transform: 'scale(1.1)' }
                                                            }}
                                                        />
                                                        <Typography variant="caption" sx={{
                                                            color: '#fff',
                                                            fontWeight: '600',
                                                            textAlign: 'center',
                                                            fontSize: '0.65rem',
                                                            lineHeight: 1.1,
                                                            textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                                                        }}>
                                                            {badge.label}
                                                        </Typography>
                                                    </motion.div>
                                                ))}
                                            </Box>
                                        </Box>
                                    ));
                                })()}
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card >
        </motion.div >
    );
};

export default GameCard;
