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
   activeMetric: string;
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

export default function TableUI({ data, loading, error, activeMetric }: TableUIProps) {
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

   const isColActive = (metricName: string) => {
      return activeMetric === 'both' || activeMetric === metricName;
   };

   // Lógica visual ajustada: Solo cambiamos el color, mantenemos fontWeight en 400 (normal)
   const getDynamicStyle = (metricName: string) => {
      const isActive = isColActive(metricName);
      return {
         color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.25)', 
         fontWeight: 400, // <-- Siempre en peso normal para no hacer "foco" excesivo
         transition: 'color 0.3s ease',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         width: '100%',
         height: '100%',
      };
   };

   const columns: GridColDef[] = [
      {
         field: 'time',
         headerName: 'Hora',
         flex: 0.8,
         minWidth: 50,
         align: 'center', 
         headerAlign: 'center', 
         sortable: false,
         renderCell: (params) => (
            <div style={{ color: 'white', fontWeight: 600, display: 'flex', justifyContent: 'center', width: '100%' }}>
               {params.value}
            </div>
         )
      },
      {
         field: 'temperature',
         headerName: 'Temp',
         flex: 1,
         minWidth: 50,
         align: 'center',
         headerAlign: 'center',
         sortable: false,
         renderCell: (params) => (
            <div style={getDynamicStyle('temperature')}>
               {params.value == null ? '-' : `${params.value.toFixed(1)}°`}
            </div>
         )
      },
      {
         field: 'windSpeed',
         headerName: 'Viento (km/h)', 
         flex: 1.5, 
         minWidth: 90, 
         align: 'center',
         headerAlign: 'center',
         sortable: false,
         renderCell: (params) => (
            <div style={getDynamicStyle('wind')}>
               {params.value == null ? '-' : (params.value as number).toFixed(1)}
            </div>
         )
      },
      {
         field: 'precipitationProbability',
         headerName: 'Lluvia',
         flex: 1,
         minWidth: 55,
         align: 'center',
         headerAlign: 'center',
         sortable: false,
         renderCell: (params) => (
            <div style={getDynamicStyle('precipitation')}>
               {params.value == null ? '-' : `${params.value}%`}
            </div>
         )
      },
      {
         field: 'humidity',
         headerName: 'Hum',
         flex: 0.8,
         minWidth: 45,
         align: 'center',
         headerAlign: 'center',
         sortable: false,
         renderCell: (params) => (
            <div style={getDynamicStyle('humidity')}>
               {params.value == null ? '-' : `${params.value}%`}
            </div>
         )
      },
      {
         field: 'uvIndex',
         headerName: 'UV',
         flex: 0.7,
         minWidth: 40,
         align: 'center',
         headerAlign: 'center',
         sortable: false,
         renderCell: (params) => (
            <div style={getDynamicStyle('uv')}>
               {params.value == null ? '-' : (params.value as number).toFixed(1)}
            </div>
         )
      },
   ];

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

                  '& .MuiDataGrid-columnHeader[data-field="time"] .MuiDataGrid-columnHeaderTitle': { color: 'rgba(255,255,255,0.9)' },
                  '& .MuiDataGrid-columnHeader[data-field="temperature"] .MuiDataGrid-columnHeaderTitle': { 
                     color: isColActive('temperature') ? '#90caf9' : 'rgba(255,255,255,0.25)', transition: 'color 0.3s' 
                  },
                  '& .MuiDataGrid-columnHeader[data-field="windSpeed"] .MuiDataGrid-columnHeaderTitle': { 
                     color: isColActive('wind') ? '#ffcc80' : 'rgba(255,255,255,0.25)', transition: 'color 0.3s' 
                  },
                  '& .MuiDataGrid-columnHeader[data-field="precipitationProbability"] .MuiDataGrid-columnHeaderTitle': { 
                     color: isColActive('precipitation') ? '#80deea' : 'rgba(255,255,255,0.25)', transition: 'color 0.3s' 
                  },
                  '& .MuiDataGrid-columnHeader[data-field="humidity"] .MuiDataGrid-columnHeaderTitle': { 
                     color: isColActive('humidity') ? '#a5d6a7' : 'rgba(255,255,255,0.25)', transition: 'color 0.3s' 
                  },
                  '& .MuiDataGrid-columnHeader[data-field="uvIndex"] .MuiDataGrid-columnHeaderTitle': { 
                     color: isColActive('uv') ? '#ce93d8' : 'rgba(255,255,255,0.25)', transition: 'color 0.3s' 
                  },

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
                  
                  '& .MuiDataGrid-footerContainer': {
                     borderTop: '1px solid rgba(255,255,255,0.15)',
                     bgcolor: 'transparent',
                     minHeight: '55px', 
                     borderBottom: 'none',
                  },
                  '& .MuiTablePagination-root': { color: 'white' },
                  '& .MuiTablePagination-displayedRows': { 
                     color: 'rgba(255,255,255,0.9)',
                     fontWeight: 500,
                  },
                  '& .MuiTablePagination-actions button': { 
                     color: 'white',
                     backgroundColor: 'rgba(255,255,255,0.08)', 
                     borderRadius: '8px', 
                     margin: '0 4px',
                     padding: '6px',
                     transition: 'all 0.2s', 
                     '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.2)', 
                     },
                     '&.Mui-disabled': {
                        opacity: 0.3,
                        backgroundColor: 'transparent', 
                     }
                  },
                  '& .MuiTablePagination-selectIcon': { display: 'none' }, 
               }}
            />
         </Box>
      </Box>
   );
}