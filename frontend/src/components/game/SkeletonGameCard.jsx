import React from 'react';
import { Card, CardContent, Box, Skeleton, Stack } from '@mui/material';

const SkeletonGameCard = () => {
    return (
        <Card
            sx={{
                width: '100%',
                minWidth: 280,
                maxWidth: 320,
                minHeight: 480,
                maxHeight: 520,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '18px',
                background: 'linear-gradient(145deg, #2a2d34 0%, #1c1e22 100%)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
        >
            {/* Cover Image Skeleton */}
            <Skeleton variant="rectangular" height={160} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

            <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Title Skeleton */}
                <Skeleton variant="text" height={32} width="80%" sx={{ bgcolor: 'rgba(255,255,255,0.1)', mx: 'auto', mb: 1 }} />

                {/* Rating Skeleton */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="rectangular" width={100} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }} />
                </Box>

                {/* Chips Skeleton */}
                <Stack direction="row" spacing={1} sx={{ mb: 2, justifyContent: 'center' }}>
                    <Skeleton variant="rounded" width={60} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                    <Skeleton variant="rounded" width={60} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                    <Skeleton variant="rounded" width={60} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                </Stack>

                {/* Progress Bar Skeleton */}
                <Box sx={{ mt: 'auto', width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Skeleton variant="text" width={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                        <Skeleton variant="text" width={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                    </Box>
                    <Skeleton variant="rounded" height={6} width="100%" sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />

                    {/* Footer Details Skeleton */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Skeleton variant="text" width={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                        <Skeleton variant="text" width={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SkeletonGameCard;
