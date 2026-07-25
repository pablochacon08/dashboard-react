import './App.css'
import { Grid, Box, Container, Typography, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import IndicatorUI from './components/IndicatorUI';
import useFetchData from './hooks/useFetchData';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import { useState } from 'react';
import SelectorUI, { type LocationData } from './components/SelectorUI';

import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import UmbrellaIcon from '@mui/icons-material/Umbrella';

const darkTheme = createTheme({
  palette: { mode: 'dark' },
  typography: { fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif' },
});

function getWeatherInfo(weatherCode: number | undefined, isDay: number | undefined, temperature: number | undefined) {
  const day = isDay !== 0;

  if (weatherCode === undefined) {
    return {
      description: 'Cargando clima...',
      bgImage: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=2070',
    };
  }

  // Si la temperatura es menor o igual a 4 grados, forzamos imagen gélida
  if (temperature !== undefined && temperature <= 4) {
    return {
      // Si de paso está nevando según el código, decimos 'Nieve', si no, 'Frío Extremo'
      description: [71, 73, 75, 77, 85, 86].includes(weatherCode) ? 'Nieve' : 'Frío Extremo',
      bgImage: 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?q=80&w=2000',
    };
  }

  if (weatherCode === 0 || weatherCode === 1) {
    return {
      description: 'Despejado',
      bgImage: day
        ? 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2065'
        : 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=2070',
    };
  }
  if (weatherCode === 2 || weatherCode === 3) {
    return {
      description: 'Nublado',
      bgImage: day
        ? 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=2070'
        : 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2069',
    };
  }
  if (weatherCode === 45 || weatherCode === 48) {
    return {
      description: 'Niebla',
      bgImage: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=2070',
    };
  }
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return {
      description: 'Lluvia',
      bgImage: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=2070',
    };
  }
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return {
      description: 'Nieve',
      bgImage: 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?q=80&w=2000',
    };
  }
  if ([95, 96, 99].includes(weatherCode)) {
    return {
      description: 'Tormenta eléctrica',
      bgImage: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=2070',
    };
  }

  return {
    description: 'Clima variable',
    bgImage: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=2070',
  };
}

function getUvLabel(uv: number): string {
  if (uv < 3) return 'Bajo';
  if (uv < 6) return 'Moderado';
  if (uv < 8) return 'Alto';
  if (uv < 11) return 'Muy alto';
  return 'Extremo';
}

export default function App() {
  const [location, setLocation] = useState<LocationData>({
      name: 'Guayaquil',
      latitude: -2.1962,
      longitude: -79.8862,
      country: 'Ecuador',
      countryCode: 'EC'
  });
  const { data, loading, error } = useFetchData(location.latitude, location.longitude);

  const { description: weatherDescription, bgImage } = getWeatherInfo(
    data?.current.weather_code,
    data?.current.is_day,
    data?.current.temperature_2m
  );

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{
        flexGrow: 1,
        minHeight: '100vh',
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        transition: 'background-image 0.6s ease-in-out',
        pt: 4, pb: 6
      }}>
        <CssBaseline />

        <Container maxWidth="xl">
          <Grid container spacing={4} sx={{ alignItems: "center", mb: 4 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ ...glassStyle, p: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h3" sx={{ fontWeight: '300', color: '#fff', letterSpacing: '2px' }}>
                  CLIMA <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{location.name}</span>
                  {location.country && (
                    <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                      , {location.country}
                    </span>
                )}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ ...glassStyle, p: 3 }}>
                <SelectorUI onOptionSelect={setLocation} selectedOption={location} />
              </Box>
            </Grid>
          </Grid>

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

          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Box sx={{ ...glassStyle, p: 4, height: '100%', position: 'relative', zIndex: 2 }}>
                <ChartUI data={data} loading={loading} error={error} />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Box sx={{ ...glassStyle, p: 4, height: '100%' }}>
                <TableUI data={data} loading={loading} error={error} />
              </Box>
            </Grid>
          </Grid>

          {data && (
            <Grid size={12}>
              <Box sx={{ ...glassStyle, p: 4 }}>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: '500',letterSpacing: '0.5px',textAlign: 'center' }}>
                  Información adicional
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <IndicatorUI icon={<WbSunnyIcon />} title='Condición' description={weatherDescription} descriptionVariant="subtitle1" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <IndicatorUI icon={<WbTwilightIcon />} title='Amanecer / Atardecer' description={`${data.daily.sunrise[0].split('T')[1]} - ${data.daily.sunset[0].split('T')[1]}`} descriptionVariant="subtitle1" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <IndicatorUI icon={<ThermostatIcon />} title='Temperatura' description={`Máx ${data.daily.temperature_2m_max[0]}° · Mín ${data.daily.temperature_2m_min[0]}°`} descriptionVariant="subtitle1" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <IndicatorUI icon={<UmbrellaIcon />} title='Índice UV máx' description={`${data.daily.uv_index_max[0]} · ${getUvLabel(data.daily.uv_index_max[0])}`} descriptionVariant="subtitle1" />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}

        </Container>
      </Box>
    </ThemeProvider>
  );
}