import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';

const AutocompleteTextField = TextField as React.ComponentType<any>;

export interface LocationData {
   name: string;
   latitude: number;
   longitude: number;
   country?: string;
   countryCode?: string;
   admin1?: string;
}

interface SelectorProps {
   onOptionSelect: (location: LocationData) => void;
   selectedOption: LocationData;
}

// Ubicaciones de acceso rápido con climas extremos para probar los fondos
const QUICK_LOCATIONS: LocationData[] = [
    { name: 'Guayaquil', latitude: -2.1962, longitude: -79.8862, country: 'Ecuador', admin1: 'Guayas' }, // Clima Tropical / Húmedo
    { name: 'Ushuaia', latitude: -54.8019, longitude: -68.3030, country: 'Argentina', admin1: 'Tierra del Fuego' }, // Frío / Posible Nieve
    { name: 'Dubái', latitude: 25.2048, longitude: 55.2708, country: 'Emiratos Árabes Unidos', admin1: 'Dubai' }, // Despejado / Calor Extremo
    { name: 'Quibdó', latitude: 5.6947, longitude: -76.6611, country: 'Colombia', admin1: 'Chocó' }, // Lluvia Extrema / Constante
    { name: 'Cuenca', latitude: -2.9006, longitude: -79.0059, country: 'Ecuador', admin1: 'Azuay' }, // Clima Andino / Variable
];

export default function SelectorUI({ onOptionSelect, selectedOption }: SelectorProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<LocationData[]>([]);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setInputValue('');
    };

    useEffect(() => {
        if (inputValue.length < 3) {
            setOptions([]);
            return;
        }

        const fetchCities = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${inputValue}&count=5&language=es&format=json`);
                const data = await res.json();

                if (data.results) {
                    const locations = data.results.map((item: any) => ({
                        name: item.name,
                        latitude: item.latitude,
                        longitude: item.longitude,
                        country: item.country,
                        countryCode: item.country_code,
                        admin1: item.admin1
                    }));
                    setOptions(locations);
                }
            } catch (error) {
                console.error("Error buscando ciudades:", error);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => { fetchCities(); }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [inputValue]);

    return (
       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          <Button
            onClick={handleOpen}
            variant="outlined"
            startIcon={<SearchIcon />}
            sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.2)',
                borderRadius: '24px',
                py: 1.5,
                px: 3,
                justifyContent: 'flex-start',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 300,
                '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255,255,255,0.4)',
                }
            }}
          >
            Buscar nueva ubicación...
          </Button>

          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1, ml: 1, fontWeight: 'bold' }}>
                UBICACIONES FRECUENTES
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {QUICK_LOCATIONS.map((loc, index) => (
                    <Chip
                        key={index}
                        icon={<LocationOnIcon fontSize="small" />}
                        label={loc.name}
                        onClick={() => onOptionSelect(loc)}
                        sx={{
                            color: 'white',
                            background: selectedOption.name === loc.name ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                            borderColor: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '12px',
                            '&:hover': { background: 'rgba(255,255,255,0.15)' },
                            '& .MuiChip-icon': { color: 'rgba(255,255,255,0.7)' }
                        }}
                        variant="outlined"
                        clickable
                    />
                ))}
            </Box>
          </Box>

          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            disableScrollLock={true}
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(6px)',
                    }
                },
                paper: {
                    sx: {
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 24px 40px rgba(0,0,0,0.6)',
                        color: 'white',
                        m: 2
                    }
                }
            }}
          >
            <DialogContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: '400', display: 'flex', alignItems: 'center' }}>
                    <SearchIcon sx={{ mr: 1.5, opacity: 0.7 }} />
                    Buscar ubicación
                </Typography>

                <Autocomplete
                    options={options}
                    getOptionLabel={(option) => `${option.name}${option.admin1 ? ', ' + option.admin1 : ''}${option.country ? ' (' + option.country + ')' : ''}`}
                    filterOptions={(x) => x}
                    autoComplete
                    includeInputInList
                    filterSelectedOptions
                    noOptionsText={inputValue.length < 3 ? 'Escribe al menos 3 letras...' : 'No se encontraron resultados'}
                    onChange={(_event, newValue: LocationData | null) => {
                        if (newValue) {
                            onOptionSelect(newValue);
                            handleClose();
                        }
                    }}
                    onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
                    slots={{ paper: Paper }}
                    slotProps={{
                        paper: {
                            sx: {
                                background: 'rgba(30, 30, 35, 0.95)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                borderRadius: '12px',
                                mt: 1,
                                border: '1px solid rgba(255,255,255,0.1)',
                                '& .MuiAutocomplete-option': {
                                    '&[aria-selected="true"]': { backgroundColor: 'rgba(255,255,255,0.1)' },
                                    '&.Mui-focused': { backgroundColor: 'rgba(255,255,255,0.08)' },
                                }
                            }
                        }
                    }}
                    renderInput={(params) => {
                        const inputProps = (params as any).InputProps ?? {};
                        return (
                            <AutocompleteTextField
                                {...params}
                                placeholder="Ej: Tokio, París, Milagro..."
                                variant="outlined"
                                autoFocus
                                InputProps={{
                                    ...inputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <>
                                            {loading && <CircularProgress color="inherit" size={20} sx={{ mr: 1, color: 'white' }} />}
                                            {inputProps.endAdornment}
                                        </>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        background: 'rgba(0,0,0,0.2)',
                                        borderRadius: '16px',
                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                                        '&.Mui-focused fieldset': { borderColor: 'white', borderWidth: '1px' },
                                    },
                                    '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)', opacity: 1 },
                                    '& .MuiAutocomplete-clearIndicator': { color: 'rgba(255,255,255,0.7)' },
                                    '& .MuiAutocomplete-popupIndicator': { color: 'rgba(255,255,255,0.7)' }
                                }}
                            />
                        );
                    }}
                />
            </DialogContent>
          </Dialog>
       </Box>
    );
}