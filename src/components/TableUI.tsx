import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface TableUIProps {
   cityName?: string | null;
   data?: OpenMeteoResponse;
   loading?: boolean;
   error?: string | null;
}

export default function TableUI({ cityName, data, loading = false, error = null }: TableUIProps) {
   const rows = (data?.hourly?.time ?? []).slice(0, 12).map((time, index) => ({
      id: index,
      time: time.split('T')[1],
      temperature: data?.hourly.temperature_2m[index] ?? null,
      windSpeed: data?.hourly.wind_speed_10m[index] ?? null,
   }));

   const columns: GridColDef[] = [
      { field: 'time', headerName: 'Hora', width: 100 },
      { field: 'temperature', headerName: `Temp (${data?.hourly_units.temperature_2m ?? ''})`, width: 130 },
      { field: 'windSpeed', headerName: `Viento (${data?.hourly_units.wind_speed_10m ?? ''})`, width: 130 },
   ];

   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress color="inherit" /></Box>;
   if (error || !rows.length) return null;

   return (
      <Box sx={{ height: '100%', width: '100%', color: 'white' }}>
         <Typography variant="h6" component="div" sx={{ mb: 3, fontWeight: '300', opacity: 0.9 }}>
            Pronóstico 12 horas - <span style={{fontWeight: 'bold'}}>{cityName}</span>
         </Typography>
         <Box sx={{ height: 315, width: '100%' }}>
            <DataGrid
               rows={rows}
               columns={columns}
               initialState={{ pagination: { paginationModel: { pageSize: 4 } } }}
               pageSizeOptions={[4]}
               disableRowSelectionOnClick
               // Estos estilos ocultan los bordes cuadrados feos del DataGrid original
               sx={{ 
                   border: 0, 
                   color: 'white',
                   '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(255,255,255,0.1)' },
                   '& .MuiDataGrid-columnHeaders': { borderBottom: '1px solid rgba(255,255,255,0.2)', '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' } },
                   '& .MuiDataGrid-footerContainer': { borderTop: 'none' }
               }}
            />
         </Box>
      </Box>
   );
}