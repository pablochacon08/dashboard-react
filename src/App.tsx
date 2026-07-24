import './App.css'
import { Grid, Box, Container, Typography, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import HeaderUI from './components/HeaderUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import useFetchData from './hooks/useFetchData';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import { useState } from 'react';

import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

// 1. Forzamos el modo oscuro para que DataGrid, Gráficos y Selectores usen texto blanco automáticamente
const darkTheme = createTheme({
  palette: { mode: 'dark' },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

export default function App() {
  const [selectedOption, setSelectedOption] = useState<string | null>('Guayaquil');
  const { data, loading, error } = useFetchData(selectedOption);
  
  // 2. Lógica de fondo dinámico basado en temperatura (ajustable)
  const temp = data?.current.temperature_2m || 25;
  let bgImage = 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=2070'; // Por defecto: nubes dramáticas

  if (temp > 28) {
    bgImage = 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2065'; // Soleado
  } else if (temp < 15) {
    bgImage = 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?q=80&w=2000'; // Frío/Nevado
  }

  // 3. Estilo maestro "Glassmorphism" que reutilizaremos en los contenedores
  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.05)', // Super transparente
    backdropFilter: 'blur(12px)', // El desenfoque del fondo (Efecto cristal)
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  };

  return (
    <ThemeProvider theme={darkTheme}>
      {/* Container principal de pantalla completa con imagen */}
      <Box sx={{ 
        flexGrow: 1, 
        minHeight: '100vh', 
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${bgImage})`, // Gradiente oscuro + imagen
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        pt: 4, pb: 6 
      }}>
        <CssBaseline /> {/* Aplica el modo oscuro globalmente */}
        
        <Container maxWidth="xl">
          <Grid container spacing={4} sx={{ alignItems: "center", mb: 4 }}>
            
            {/* Sintaxis corregida para MUI v6: size={{ ... }} */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ ...glassStyle, p: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h3" sx={{ fontWeight: '300', color: '#fff', letterSpacing: '2px' }}>
                  CLIMA <span style={{fontWeight: 'bold'}}>LOCAL</span>
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ ...glassStyle, p: 3 }}>
                <SelectorUI onOptionSelect={setSelectedOption} selectedOption={selectedOption} />
              </Box>
            </Grid>

          </Grid>

          {/* Indicadores */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {data && <IndicatorUI icon={<ThermostatIcon />} title='Temperatura' description={`${data.current.temperature_2m} ${data.current_units.temperature_2m}`} />}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {data && <IndicatorUI icon={<WbSunnyIcon />} title='Sensación' description={`${data.current.apparent_temperature} ${data.current_units.apparent_temperature}`} />}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {data && <IndicatorUI icon={<AirIcon />} title='Viento' description={`${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`} />}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {data && <IndicatorUI icon={<OpacityIcon />} title='Humedad' description={`${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}`} />}
            </Grid>
          </Grid>

          {/* Gráficos y Tabla */}
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 7 }}> 
              <Box sx={{ ...glassStyle, p: 4, height: '100%' }}>
                <ChartUI cityName={selectedOption} data={data} loading={loading} error={error} />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}> 
              <Box sx={{ ...glassStyle, p: 4, height: '100%' }}>
                <TableUI cityName={selectedOption} data={data} loading={loading} error={error} />
              </Box>
            </Grid>
          </Grid>
          
        </Container>
      </Box>
    </ThemeProvider>
  );
}
