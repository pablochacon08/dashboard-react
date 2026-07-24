import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


// Defina la interfaz del prop
interface SelectorProps {
   onOptionSelect: (option: string) => void;
   selectedOption: string | null;
}

// Defina el prop en el componente
export default function Selector({ onOptionSelect, selectedOption }: SelectorProps) {
    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value;
        onOptionSelect(selectedValue);
    };

    return (
       <FormControl fullWidth>
          <InputLabel id="city-select-label">Ciudad</InputLabel>
          <Select 
             labelId="city-select-label"
             id="city-simple-select"
             label="Ciudad"
             onChange={handleChange}
             value={selectedOption ?? ''}>
             <MenuItem disabled value=""><em>Seleccione una ciudad</em></MenuItem>
             <MenuItem value="Guayaquil">Guayaquil</MenuItem>
             <MenuItem value="Quito">Quito</MenuItem>
             <MenuItem value="Manta">Manta</MenuItem>
             <MenuItem value="Cuenca">Cuenca</MenuItem>
          </Select>
          {selectedOption && (
                <p>
                    Información del clima en <span style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{selectedOption}</span>
                </p>
            )}
       </FormControl>
    );
}
