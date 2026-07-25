import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
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
         hour12: false 
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
      flex: 0.8,
      minWidth: 50,
      align: 'center', 
      headerAlign: 'center', 
      sortable: false,
   },
   {
      field: 'temperature',
      headerName: 'Temp',
      flex: 1,
      minWidth: 50,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      valueFormatter: (value: number | null | undefined) => value == null ? '-' : `${value.toFixed(1)}°`,
   },
   {
      field: 'windSpeed',
      headerName: 'Viento (km/h)', 
      flex: 1.5, 
      minWidth: 90, 
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      valueFormatter: (value: number | null | undefined) => value == null ? '-' : `${value.toFixed(1)}`, 
   },
   {
      field: 'precipitationProbability',
      headerName: 'Lluvia',
      flex: 1,
      minWidth: 55,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      valueFormatter: (value: number | null | undefined) => value == null ? '-' : `${value}%`,
   },
   {
      field: 'humidity',
      headerName: 'Hum',
      flex: 0.8,
      minWidth: 45,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      valueFormatter: (value: number | null | undefined) => value == null ? '-' : `${value}%`,
   },
   {
      field: 'uvIndex',
      headerName: 'UV',
      flex: 0.7,
      minWidth: 40,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      valueFormatter: (value: number | null | undefined) => value == null ? '-' : `${value.toFixed(1)}`,
   },
];

export default function TableUI({ data, loading, error }: TableUIProps) {
   if (loading && !data) {
      return (
         <Box sx={{ height: '100%', minHeight: 350, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: 'white' }} />
         </Box>
      );
   }

   if (error) {
      return (
         <Box sx={{ height: '100%', minHeight: 350, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Alert severity="error">{error}</Alert>
         </Box>
      );
   }

   if (!data) {
      return (
         <Box sx={{ height: '100%', minHeight: 350, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Alert severity="info">No hay datos disponibles.</Alert>
         </Box>
      );
   }

   const rows = processHourlyData(data);

   return (
      <Box sx={{ 
         height: '100%', 
         minHeight: 400, 
         width: '100%', 
         display: 'flex', 
         flexDirection: 'column', 
         justifyContent: 'flex-start' 
      }}>
         
         <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 500, letterSpacing: '0.5px' }}>
               Detalle de Valores
            </Typography>
         </Box>

         <Box sx={{ height: 400, width: '100%', overflow: 'hidden' }}>
            <DataGrid
               rows={rows}
               columns={columns}
               initialState={{
                  pagination: {
                     paginationModel: {
                        pageSize: 7, 
                     },
                  },
               }}
               pageSizeOptions={[7]}
               disableRowSelectionOnClick
               disableColumnMenu
               rowHeight={42} 
               columnHeaderHeight={42} 
               sx={{
                  border: 0,
                  color: 'white',
                  fontSize: '0.90rem',
                  bgcolor: 'transparent',
                  '& .MuiDataGrid-main': { bgcolor: 'transparent' },
                  '& .MuiDataGrid-virtualScroller': {
                     bgcolor: 'transparent',
                     overflowX: 'hidden !important',
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
                     padding: '0 4px', 
                  },
                  '& .MuiDataGrid-columnHeaderTitleContainer': {
                     justifyContent: 'center', 
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                     fontWeight: 700,
                     letterSpacing: '1px',
                     textTransform: 'uppercase',
                     fontSize: '0.7rem', 
                     textAlign: 'center',
                     width: '100%',
                  },

                  // Colores de cabecera
                  '& .MuiDataGrid-columnHeader[data-field="time"] .MuiDataGrid-columnHeaderTitle': { color: 'rgba(255,255,255,0.9)' },
                  '& .MuiDataGrid-columnHeader[data-field="temperature"] .MuiDataGrid-columnHeaderTitle': { color: '#90caf9' },
                  '& .MuiDataGrid-columnHeader[data-field="windSpeed"] .MuiDataGrid-columnHeaderTitle': { color: '#ffcc80' },
                  '& .MuiDataGrid-columnHeader[data-field="precipitationProbability"] .MuiDataGrid-columnHeaderTitle': { color: '#80deea' },
                  '& .MuiDataGrid-columnHeader[data-field="humidity"] .MuiDataGrid-columnHeaderTitle': { color: '#a5d6a7' },
                  '& .MuiDataGrid-columnHeader[data-field="uvIndex"] .MuiDataGrid-columnHeaderTitle': { color: '#ce93d8' },

                  '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
                  '& .MuiDataGrid-row': { bgcolor: 'transparent !important' },
                  '& .MuiDataGrid-row:hover': { bgcolor: 'rgba(255,255,255,0.08) !important' },
                  
                  '& .MuiDataGrid-cell': {
                     borderBottom: '1px solid rgba(255,255,255,0.08)',
                     padding: '0 4px', 
                     color: 'rgba(255,255,255,0.85)', 
                  },
                  '& .MuiDataGrid-cell[data-field="time"]': {
                     fontWeight: 600,
                     color: 'white', 
                  },
                  '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': { borderBottom: 'none' },
                  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
                  '& .MuiDataGrid-columnSeparator': { display: 'none' },
                  
                  // CONTENEDOR DE PAGINACIÓN Y MEJORAS DE LOS BOTONES
                  '& .MuiDataGrid-footerContainer': {
                     borderTop: '1px solid rgba(255,255,255,0.15)',
                     bgcolor: 'transparent',
                     minHeight: '55px', // Un poco más de altura para que respiren los botones
                     borderBottom: 'none',
                  },
                  '& .MuiTablePagination-root': { color: 'white' },
                  // Estilo para el texto "1 - 7 de 24 horas"
                  '& .MuiTablePagination-displayedRows': { 
                     color: 'rgba(255,255,255,0.9)',
                     fontWeight: 500,
                  },
                  // Estilo para los botones de las flechas
                  '& .MuiTablePagination-actions button': { 
                     color: 'white',
                     backgroundColor: 'rgba(255,255,255,0.08)', // Fondo de botón
                     borderRadius: '8px', // Bordes redondeados modernos
                     margin: '0 4px',
                     padding: '6px',
                     transition: 'all 0.2s', // Animación suave
                     '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.2)', // Brillo al pasar el mouse
                     },
                     '&.Mui-disabled': {
                        opacity: 0.3,
                        backgroundColor: 'transparent', // Flecha inactiva se funde con el fondo
                     }
                  },
                  '& .MuiTablePagination-selectIcon': { display: 'none' }, // Ocultar flecha del selector si no se usa
               }}
            />
         </Box>
      </Box>
   );
}