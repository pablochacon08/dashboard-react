import { useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { LineChart } from '@mui/x-charts/LineChart';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface ChartUIProps {
   cityName?: string | null;
   data?: OpenMeteoResponse;
   loading?: boolean;
   error?: string | null;
}

export default function ChartUI({ cityName, data, loading = false, error = null }: ChartUIProps) {
   const [variable, setVariable] = useState<'temperatura' | 'viento'>('temperatura');

   const labels = (data?.hourly?.time ?? []).slice(0, 24).map(t => t.split('T')[1]);
   const temperatureValues = (data?.hourly?.temperature_2m ?? []).slice(0, 24);
   const windValues = (data?.hourly?.wind_speed_10m ?? []).slice(0, 24);

   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress color="inherit" /></Box>;
   if (error || !labels.length) return null;

   const chartData = variable === 'temperatura' ? temperatureValues : windValues;
   const chartLabel = variable === 'temperatura' ? `Temperatura (${data?.hourly_units.temperature_2m ?? ''})` : `Viento (${data?.hourly_units.wind_speed_10m ?? ''})`;

   return (
      <Box sx={{ color: 'white' }}>
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
             <Typography variant="h6" component="div" sx={{ fontWeight: '300' }}>
                Fluctuación - <span style={{fontWeight: 'bold'}}>{cityName}</span>
             </Typography>
             
             {/* Selector estilo Glass */}
             <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                   value={variable}
                   onChange={(e) => setVariable(e.target.value as 'temperatura' | 'viento')}
                   sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
                >
                   <MenuItem value="temperatura">Temperatura</MenuItem>
                   <MenuItem value="viento">Viento</MenuItem>
                </Select>
             </FormControl>
         </Box>
         
         <LineChart
            height={300}
            // Agregamos un color llamativo (Amarillo pastel/Cian) estilo dashboard futurista
            series={[{ data: chartData, label: chartLabel, color: variable === 'temperatura' ? '#ffeb3b' : '#00e5ff' }]}
            xAxis={[{ scaleType: 'point', data: labels }]}
            sx={{
               // Forzamos ejes a blanco
               '& .MuiChartsAxis-tickLabel': { fill: 'rgba(255,255,255,0.7) !important' },
               '& .MuiChartsAxis-line': { stroke: 'rgba(255,255,255,0.2) !important' },
               '& .MuiChartsAxis-tick': { stroke: 'rgba(255,255,255,0.2) !important' }
            }}
         />
      </Box>
   );
}