import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Defina la interfaz del prop
interface SelectorProps {
   onOptionSelect: (option: string) => void;
   selectedOption: string | null;
}

// Array con las ciudades disponibles
const CITIES = ['Guayaquil', 'Quito', 'Manta', 'Cuenca'];

export default function Selector({ onOptionSelect, selectedOption }: SelectorProps) {
    return (
       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Título pequeño y elegante con icono */}
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
             <LocationOnIcon sx={{ fontSize: '1.2rem', mr: 0.5 }}/>
             Seleccionar Ubicación
          </Typography>
          
          {/* Contenedor flexible para los botones */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
             {CITIES.map((city) => {
                const isActive = selectedOption === city;
                
                return (
                    <Button
                        key={city}
                        onClick={() => onOptionSelect(city)}
                        disableElevation
                        variant={isActive ? "contained" : "outlined"}
                        sx={{
                            borderRadius: '24px', // Bordes completamente redondeados (estilo píldora)
                            textTransform: 'none', // Evita que el texto esté todo en mayúsculas
                            fontWeight: isActive ? 'bold' : 'normal',
                            px: 3, // Padding horizontal para que no se vean apretados
                            
                            // Lógica de colores estilo Glassmorphism
                            borderColor: isActive ? 'transparent' : 'rgba(255,255,255,0.3)',
                            bgcolor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            
                            // Efecto hover
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.35)',
                                borderColor: 'transparent'
                            }
                        }}
                    >
                        {city}
                    </Button>
                );
             })}
          </Box>
       </Box>
    );
}