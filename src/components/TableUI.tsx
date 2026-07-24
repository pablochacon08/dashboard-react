import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { CircularProgress } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

interface TableUIProps {
   data: OpenMeteoResponse | null;
   loading: boolean;
   error: string | null;
}

function processHourlyData(data: OpenMeteoResponse) {
   const hours = Math.min(24, data.hourly.time.length);
   return data.hourly.time.slice(0, hours).map((time, index) => ({
      id: index,
      time: new Date(time).toLocaleString('sv-SE', {
         year: 'numeric',
         month: '2-digit',
         day: '2-digit',
         hour: '2-digit',
         minute: '2-digit',
      }).replace(' ', ' '),
      temperature: data.hourly.temperature_2m[index],
      windSpeed: data.hourly.wind_speed_10m[index],
   }));
}

const columns: GridColDef[] = [ 
   { field: 'id', headerName: 'ID', width: 60 },
   {
      field: 'time',
      headerName: 'Hora',
      width: 170,
   },
   {
      field: 'temperature',
      headerName: 'Temperatura (°C)',
      width: 150,
      valueFormatter: (value: number | null | undefined) => value === null || value === undefined ? '-' : `${value.toFixed(1)}`,
   },
   {
      field: 'windSpeed',
      headerName: 'Viento (km/h)',
      width: 150,
      valueFormatter: (value: number | null | undefined) => value === null || value === undefined ? '-' : `${value.toFixed(1)}`,
   },
];

export default function TableUI({ data, loading, error }: TableUIProps) {
   if (loading && !data) {
      return (
         <Box sx={{ height: 350, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
         </Box>
      );
   }

   if (error) {
      return (
         <Box sx={{ height: 350, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Alert severity="error">{error}</Alert>
         </Box>
      );
   }

   if (!data) {
      return (
         <Box sx={{ height: 350, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Alert severity="info">No hay datos disponibles.</Alert>
         </Box>
      );
   }

   const rows = processHourlyData(data);

   return (
      <Box sx={{ height: 350, width: '100%' }}>
         <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
               pagination: {
                  paginationModel: {
                     pageSize: 5,
                  },
               },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
         />
      </Box>
   );
}