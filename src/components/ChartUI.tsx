import { useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { CircularProgress, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

interface ChartUIProps {
   data: OpenMeteoResponse | null;
   loading: boolean;
   error: string | null;
}

type ChartVariable = 'temperature' | 'wind' | 'precipitation' | 'humidity' | 'uv' | 'both';

function processChartData(data: OpenMeteoResponse) {
   const hours = Math.min(24, data.hourly.time.length);
   const times = data.hourly.time.slice(0, hours).map(time => {
      const date = new Date(time);
      return date.toLocaleTimeString('es-EC', {
         hour: '2-digit',
         minute: '2-digit',
      });
   });
   const temperatures = data.hourly.temperature_2m.slice(0, hours);
   const windSpeeds = data.hourly.wind_speed_10m.slice(0, hours);
   const precipitationProbabilities = data.hourly.precipitation_probability.slice(0, hours);
   const humidities = data.hourly.relative_humidity_2m.slice(0, hours);
   const uvIndexes = data.hourly.uv_index.slice(0, hours);

   return { times, temperatures, windSpeeds, precipitationProbabilities, humidities, uvIndexes };
}

export default function ChartUI({ data, loading, error }: ChartUIProps) {
   const [variable, setVariable] = useState<ChartVariable>('both');

   const handleVariableChange = (
      _event: React.MouseEvent<HTMLElement>,
      newVariable: ChartVariable | null
   ) => {
      if (newVariable !== null) {
         setVariable(newVariable);
      }
   };

   if (loading && !data) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress sx={{ color: 'white' }} />
         </Box>
      );
   }
   if (error) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Alert severity="error">{error}</Alert>
         </Box>
      );
   }
   if (!data) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Alert severity="info">No hay datos disponibles.</Alert>
         </Box>
      );
   }

   const { times, temperatures, windSpeeds, precipitationProbabilities, humidities, uvIndexes } = processChartData(data);

   // Eje izquierdo: temperatura y viento (magnitudes libres)
   // Eje derecho: lluvia, humedad, UV (todas en escala 0-100 aprox)
   const series = [
      ...(variable === 'temperature' || variable === 'both'
         ? [{ data: temperatures, label: 'Temperatura (°C)', color: '#5b8def', yAxisId: 'leftAxis' }]
         : []),
      ...(variable === 'wind' || variable === 'both'
         ? [{ data: windSpeeds, label: 'Viento (km/h)', color: '#ffb84d', yAxisId: 'leftAxis' }]
         : []),
      ...(variable === 'precipitation' || variable === 'both'
         ? [{ data: precipitationProbabilities, label: 'Prob. de lluvia (%)', color: '#4dd0e1', yAxisId: 'rightAxis' }]
         : []),
      ...(variable === 'humidity' || variable === 'both'
         ? [{ data: humidities, label: 'Humedad (%)', color: '#81c784', yAxisId: 'rightAxis' }]
         : []),
      ...(variable === 'uv' || variable === 'both'
         ? [{ data: uvIndexes, label: 'Índice UV', color: '#ba68c8', yAxisId: 'rightAxis' }]
         : []),
   ];

   // Solo mostramos el eje derecho cuando hay alguna serie que lo use
   const usesRightAxis = variable === 'both' || variable === 'precipitation' || variable === 'humidity' || variable === 'uv';

   return (
      <Box>
         <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 500, color: '#fff' }}>
            Pronóstico por hora (24h)
         </Typography>
         <ToggleButtonGroup
            value={variable}
            exclusive
            onChange={handleVariableChange}
            size="small"
            sx={{
               mb: 2,
               flexWrap: 'wrap',
               gap: 1,
               '& .MuiToggleButton-root': {
                  color: 'rgba(255,255,255,0.7)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: '20px !important',
                  px: 2,
               },
               '& .MuiToggleButton-root.Mui-selected': {
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.15)',
               },
            }}
         >
            <ToggleButton value="temperature">Temperatura</ToggleButton>
            <ToggleButton value="wind">Viento</ToggleButton>
            <ToggleButton value="precipitation">Lluvia</ToggleButton>
            <ToggleButton value="humidity">Humedad</ToggleButton>
            <ToggleButton value="uv">Índice UV</ToggleButton>
            <ToggleButton value="both">Todos</ToggleButton>
         </ToggleButtonGroup>
         <LineChart
            height={350}
            series={series}
            xAxis={[{ scaleType: 'point', data: times, id: 'xAxis' }]}
            yAxis={[
               { id: 'leftAxis' },
               ...(usesRightAxis ? [{ id: 'rightAxis', position: 'right' as const, max: 100 }] : []),
            ]}
            margin={{ bottom: 40, left: 50, right: usesRightAxis ? 50 : 10, top: 20 }}
            sx={{
               '& .MuiChartsAxis-tickLabel': {
                  fill: 'rgba(255,255,255,0.75) !important',
                  fontSize: '0.75rem',
               },
               '& .MuiChartsAxis-line': {
                  stroke: 'rgba(255,255,255,0.25) !important',
               },
               '& .MuiChartsAxis-tick': {
                  stroke: 'rgba(255,255,255,0.25) !important',
               },
               '& .MuiChartsLegend-series text': {
                  fill: 'rgba(255,255,255,0.9) !important',
               },
               '& .MuiChartsGrid-line': {
                  stroke: 'rgba(255,255,255,0.08) !important',
               },
            }}
            grid={{ horizontal: true }}
         />
      </Box>
   );
}