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
}

export default function IndicatorUI(props: IndicatorUIProps) {
    return (
        <Card elevation={0} sx={{ 
            height: '100%', 
            background: 'rgba(255, 255, 255, 0.05)', // Cristal
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px', 
            color: 'white'
        }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {/* Icono con fondo semitransparente */}
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', width: 48, height: 48, mr: 2, color: 'white' }}>
                        {props.icon}
                    </Avatar>
                    
                    {/* Texto grande (Número) */}
                    <Typography variant="h3" component="div" sx={{ fontWeight: '400' }}>
                        {props.description}
                    </Typography>
                </Box>
                
                {/* Título pequeño */}
                <Typography variant="overline" component="p" sx={{ opacity: 0.7, fontWeight: 'bold', ml: 8, letterSpacing: '1px' }}>
                    {props.title}
                </Typography>
            </CardContent>
        </Card>
    )
}