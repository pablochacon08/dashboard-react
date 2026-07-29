import './App.css';

import { useEffect, useState } from 'react';

import {
  Grid,
  Box,
  Container,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Button,
  CircularProgress,
} from '@mui/material';

import IndicatorUI from './components/IndicatorUI';
import TableUI from './components/TableUI';
// IMPORTANTE: Importamos el componente y el tipo ChartVariable
import ChartUI, { type ChartVariable } from './components/ChartUI'; 
import SelectorUI, {
  type LocationData,
} from './components/SelectorUI';

import useFetchData from './hooks/useFetchData';

import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudIcon from '@mui/icons-material/Cloud';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily:
      '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const DEFAULT_LOCATION: LocationData = {
  name: 'Guayaquil',
  latitude: -2.1962,
  longitude: -79.8862,
  country: 'Ecuador',
  countryCode: 'EC',
};

const LOCATION_STORAGE_KEY = 'lastLocation';

function isValidLocation(value: unknown): value is LocationData {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const location = value as Partial<LocationData>;

  return (
    typeof location.name === 'string' &&
    location.name.trim().length > 0 &&
    typeof location.latitude === 'number' &&
    Number.isFinite(location.latitude) &&
    typeof location.longitude === 'number' &&
    Number.isFinite(location.longitude)
  );
}

function getInitialLocation(): LocationData {
  try {
    const savedLocation = localStorage.getItem(
      LOCATION_STORAGE_KEY
    );

    if (!savedLocation) {
      return DEFAULT_LOCATION;
    }

    const parsedLocation: unknown = JSON.parse(savedLocation);

    if (!isValidLocation(parsedLocation)) {
      localStorage.removeItem(LOCATION_STORAGE_KEY);
      return DEFAULT_LOCATION;
    }

    return parsedLocation;
  } catch (error) {
    console.error(
      'Error recuperando la última ciudad:',
      error
    );

    return DEFAULT_LOCATION;
  }
}

function getWeatherInfo(
  weatherCode: number | undefined,
  isDay: number | undefined,
  temperature: number | undefined
) {
  const day = isDay !== 0;

  if (weatherCode === undefined) {
    return {
      description: 'Cargando clima...',
      bgImage:
        'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=2070',
    };
  }

  if (temperature !== undefined && temperature <= 4) {
    return {
      description: [71, 73, 75, 77, 85, 86].includes(
        weatherCode
      )
        ? 'Nieve'
        : 'Frío extremo',
      bgImage:
        'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?q=80&w=2000',
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
      bgImage:
        'https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=2070',
    };
  }

  if (
    [
      51, 53, 55, 56, 57,
      61, 63, 65, 66, 67,
      80, 81, 82,
    ].includes(weatherCode)
  ) {
    return {
      description: 'Lluvia',
      bgImage:
        'https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=2070',
    };
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return {
      description: 'Nieve',
      bgImage:
        'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?q=80&w=2000',
    };
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return {
      description: 'Tormenta eléctrica',
      bgImage:
        'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=2070',
    };
  }

  return {
    description: 'Clima variable',
    bgImage:
      'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=2070',
  };
}

function getWeatherIcon(
  weatherCode: number | undefined,
  isDay: number | undefined
) {
  const day = isDay !== 0;

  if (weatherCode === undefined) {
    return <CloudIcon />;
  }

  if (weatherCode === 0 || weatherCode === 1) {
    return day ? <WbSunnyIcon /> : <NightsStayIcon />;
  }

  if (weatherCode === 2 || weatherCode === 3) {
    return <CloudIcon />;
  }

  if (weatherCode === 45 || weatherCode === 48) {
    return <FilterDramaIcon />;
  }

  if (
    [
      51, 53, 55, 56, 57,
      61, 63, 65, 66, 67,
      80, 81, 82,
    ].includes(weatherCode)
  ) {
    return <UmbrellaIcon />;
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return <AcUnitIcon />;
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return <ThunderstormIcon />;
  }

  return <CloudIcon />;
}

function getUvLabel(uv: number): string {
  if (uv < 3) return 'Bajo';
  if (uv < 6) return 'Moderado';
  if (uv < 8) return 'Alto';
  if (uv < 11) return 'Muy alto';

  return 'Extremo';
}

export default function App() {
  const [location, setLocation] =
    useState<LocationData>(getInitialLocation);

  // NUEVO ESTADO: Controla la métrica seleccionada para sincronizar el gráfico y la tabla
  const [activeMetric, setActiveMetric] = useState<ChartVariable>('both');

  const {
    data,
    loading,
    error,
    lastUpdated,
    refreshData,
  } = useFetchData(
    location.latitude,
    location.longitude
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        LOCATION_STORAGE_KEY,
        JSON.stringify(location)
      );
    } catch (error) {
      console.error(
        'Error guardando la última ciudad:',
        error
      );
    }
  }, [location]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      refreshData();
    }, 5 * 60 * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [refreshData]);

  const {
    description: weatherDescription,
    bgImage,
  } = getWeatherInfo(
    data?.current.weather_code,
    data?.current.is_day,
    data?.current.temperature_2m
  );

  const weatherIcon = getWeatherIcon(
    data?.current.weather_code,
    data?.current.is_day
  );

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  };

  const formattedLastUpdated = lastUpdated
    ? lastUpdated.toLocaleTimeString('es-EC', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'Pendiente';

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Box
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          backgroundImage: `
            linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.3),
              rgba(0, 0, 0, 0.7)
            ),
            url(${bgImage})
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          transition:
            'background-image 0.6s ease-in-out',
          pt: 4,
          pb: 6,
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={4}
            sx={{
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Grid size={{ xs: 12, md: 8 }}>
              <Box
                sx={{
                  ...glassStyle,
                  p: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 300,
                    color: '#fff',
                    letterSpacing: '2px',
                  }}
                >
                  CLIMA{' '}
                  <span
                    style={{
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    {location.name}
                  </span>

                  {location.country && (
                    <span
                      style={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                      }}
                    >
                      , {location.country}
                    </span>
                  )}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  ...glassStyle,
                  p: 3,
                }}
              >
                <SelectorUI
                  onOptionSelect={setLocation}
                  selectedOption={location}
                />
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              ...glassStyle,
              p: 2.5,
              mb: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: {
                xs: 'flex-start',
                sm: 'center',
              },
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#fff',
                  fontWeight: 500,
                }}
              >
                Datos del clima en tiempo real
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  mt: 0.5,
                }}
              >
                Última actualización:{' '}
                {formattedLastUpdated}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.55)',
                  display: 'block',
                  mt: 0.5,
                }}
              >
                Actualización automática cada 5 minutos
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={
                loading ? (
                  <CircularProgress
                    size={18}
                    color="inherit"
                  />
                ) : (
                  <RefreshIcon />
                )
              }
              onClick={refreshData}
              disabled={loading}
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1.2,
                textTransform: 'none',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {loading
                ? 'Actualizando...'
                : 'Actualizar'}
            </Button>
          </Box>

          <Grid
            container
            spacing={3}
            sx={{ mb: 4 }}
          >
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              {data && (
                <IndicatorUI
                  icon={<ThermostatIcon />}
                  title="Temperatura"
                  description={`${data.current.temperature_2m} ${data.current_units.temperature_2m}`}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              {data && (
                <IndicatorUI
                  icon={<WbSunnyIcon />}
                  title="Sensación"
                  description={`${data.current.apparent_temperature} ${data.current_units.apparent_temperature}`}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              {data && (
                <IndicatorUI
                  icon={<AirIcon />}
                  title="Viento"
                  description={`${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              {data && (
                <IndicatorUI
                  icon={<OpacityIcon />}
                  title="Humedad"
                  description={`${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}`}
                />
              )}
            </Grid>
          </Grid>

          <Grid
            container
            spacing={4}
            sx={{ mb: 4 }}
          >
            <Grid size={{ xs: 12, lg: 7 }}>
              <Box
                sx={{
                  ...glassStyle,
                  p: {
                    xs: 2,
                    md: 4,
                  },
                  height: '100%',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {/* PASAMOS LAS PROPS DE ESTADO AL GRÁFICO */}
                <ChartUI
                  data={data}
                  loading={loading}
                  error={error}
                  activeMetric={activeMetric}
                  setActiveMetric={setActiveMetric}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Box
                sx={{
                  ...glassStyle,
                  p: {
                    xs: 2,
                    md: 4,
                  },
                  height: '100%',
                }}
              >
                {/* PASAMOS EL ESTADO A LA TABLA */}
                <TableUI
                  data={data}
                  loading={loading}
                  error={error}
                  activeMetric={activeMetric}
                />
              </Box>
            </Grid>
          </Grid>

          {data && (
            <Grid size={12}>
              <Box
                sx={{
                  ...glassStyle,
                  p: 4,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: '#fff',
                    mb: 3,
                    fontWeight: 300,
                  }}
                >
                  Información adicional
                </Typography>

                <Grid container spacing={3}>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 3,
                    }}
                  >
                    <IndicatorUI
                      icon={weatherIcon}
                      title="Condición"
                      description={weatherDescription}
                      descriptionVariant="subtitle1"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 3,
                    }}
                  >
                    <IndicatorUI
                      icon={<WbTwilightIcon />}
                      title="Amanecer / Atardecer"
                      description={`${
                        data.daily.sunrise[0].split('T')[1]
                      } - ${
                        data.daily.sunset[0].split('T')[1]
                      }`}
                      descriptionVariant="subtitle1"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 3,
                    }}
                  >
                    <IndicatorUI
                      icon={<ThermostatIcon />}
                      title="Temperatura"
                      description={`Máx ${data.daily.temperature_2m_max[0]}° · Mín ${data.daily.temperature_2m_min[0]}°`}
                      descriptionVariant="subtitle1"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 3,
                    }}
                  >
                    <IndicatorUI
                      icon={<UmbrellaIcon />}
                      title="Índice UV máx"
                      description={`${
                        data.daily.uv_index_max[0]
                      } · ${getUvLabel(
                        data.daily.uv_index_max[0]
                      )}`}
                      descriptionVariant="subtitle1"
                    />
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