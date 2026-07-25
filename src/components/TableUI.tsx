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
      time: new Date(time).toLocaleTimeString('es-EC', {
         hour: '2-digit',
         minute: '2-digit',
      }),
      temperature: data.hourly.temperature_2m[index],
      windSpeed: data.hourly.wind_speed_10m[index],
   }));
}

const columns: GridColDef[] = [
   {
      field: 'time',
      headerName: 'Hora',
      flex: 1,
      minWidth: 90,
   },
   {
      field: 'temperature',
      headerName: 'Temp. (°C)',
      flex: 1,
      minWidth: 110,
      valueFormatter: (value: number | null | undefined) => value === null || value === undefined ? '-' : `${value.toFixed(1)}`,
   },
   {
      field: 'windSpeed',
      headerName: 'Viento (km/h)',
      flex: 1,
      minWidth: 120,
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
            disableColumnMenu
            sx={{
               border: 0,
               color: 'white',
               '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(255,255,255,0.1)' },
               '& .MuiDataGrid-columnHeaders': {
                  borderBottom: '1px solid rgba(255,255,255,0.2)',
                  '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' },
               },
               '& .MuiDataGrid-footerContainer': { borderTop: 'none' },
               '& .MuiTablePagination-root': { color: 'white' },
               '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
            }}
         />
      </Box>
   );
}