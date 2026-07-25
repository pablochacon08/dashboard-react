import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import React from 'react';

interface IndicatorUIProps {
    title?: string;
    description?: string;
    icon: React.ReactNode;
    descriptionVariant?: 'h3' | 'h5' | 'h6' | 'subtitle1';
    noWrap?: boolean;
}

export default function IndicatorUI({ title, description, icon, descriptionVariant = 'h3', noWrap = false }: IndicatorUIProps) {
    return (
        <Card elevation={0} sx={{
            height: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            color: 'white'
        }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', width: 48, height: 48, mr: 2, color: 'white', flexShrink: 0 }}>
                        {icon}
                    </Avatar>

                    <Typography
                        variant={descriptionVariant}
                        component="div"
                        sx={{
                            fontWeight: '400',
                            ...(noWrap && {
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }),
                        }}
                    >
                        {description}
                    </Typography>
                </Box>

                <Typography variant="overline" component="p" sx={{ opacity: 0.7, fontWeight: 'bold', ml: 8, letterSpacing: '1px' }}>
                    {title}
                </Typography>
            </CardContent>
        </Card>
    )
}