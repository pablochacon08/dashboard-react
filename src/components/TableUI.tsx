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
      precipitationProbability: data.hourly.precipitation_probability[index],
      humidity: data.hourly.relative_humidity_2m[index],
      uvIndex: data.hourly.uv_index[index],
   }));
}

const columns: GridColDef[] = [
   {
      field: 'time',
      headerName: 'Hora',
      flex: 1,
      minWidth: 90,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
   },
   {
      field: 'temperature',
      headerName: 'Temp. (°C)',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      valueFormatter: (value: number | null | undefined) => value === null || value === undefined ? '-' : `${value.toFixed(1)}°`,
   },
   {
      field: 'windSpeed',
      headerName: 'Viento (km/h)',
      flex: 1,
      minWidth: 110,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      valueFormatter: (value: number | null | undefined) => value === null || value === undefined ? '-' : `${value.toFixed(1)}`,
   },
   {
      field: 'precipitationProbability',
      headerName: 'Lluvia (%)',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      valueFormatter: (value: number | null | undefined) => value === null || value === undefined ? '-' : `${value}%`,
   },
   {
      field: 'humidity',
      headerName: 'Humedad (%)',
      flex: 1,
      minWidth: 110,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      valueFormatter: (value: number | null | undefined) => value === null || value === undefined ? '-' : `${value}%`,
   },
   {
      field: 'uvIndex',
      headerName: 'Índice UV',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      valueFormatter: (value: number | null | undefined) => value === null || value === undefined ? '-' : `${value.toFixed(1)}`,
   },
];

export default function TableUI({ data, loading, error }: TableUIProps) {
   if (loading && !data) {
      return (
         <Box sx={{ height: 350, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: 'white' }} />
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
               fontSize: '0.95rem',
               bgcolor: 'transparent',
               '& .MuiDataGrid-main': { bgcolor: 'transparent' },
               '& .MuiDataGrid-virtualScroller': {
                  bgcolor: 'transparent',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': {
                     display: 'none',
                  },
               },
               '& .MuiDataGrid-columnHeaders': {
                  bgcolor: 'transparent !important',
                  backgroundImage: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.2)',
               },
               '& .MuiDataGrid-columnHeader': {
                  bgcolor: 'transparent !important',
               },
               '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '0.7rem',
                  opacity: 0.7,
               },
               '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                  outline: 'none',
               },
               '& .MuiDataGrid-row': { bgcolor: 'transparent !important' },
               '& .MuiDataGrid-row:hover': { bgcolor: 'rgba(255,255,255,0.08) !important' },
               '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
               },
               '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
               '& .MuiDataGrid-columnSeparator': { display: 'none' },
               '& .MuiDataGrid-footerContainer': {
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  bgcolor: 'transparent',
               },
               '& .MuiTablePagination-root': { color: 'white' },
               '& .MuiTablePagination-selectIcon': { color: 'white' },
               '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' },
            }}
         />
      </Box>
   );
}