import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface SelectorProps {
   onOptionSelect: (option: string) => void;
   selectedOption: string | null;
}

export default function Selector({ onOptionSelect, selectedOption }: SelectorProps) {
    const handleChange = (event: SelectChangeEvent<string>) => {
        onOptionSelect(event.target.value);
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
             <MenuItem value="guayaquil">Guayaquil</MenuItem>
             <MenuItem value="quito">Quito</MenuItem>
             <MenuItem value="manta">Manta</MenuItem>
             <MenuItem value="cuenca">Cuenca</MenuItem>
          </Select>
          {selectedOption && (
                <p>
                    Información del clima en <span style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{selectedOption}</span>
                </p>
            )}
       </FormControl>
    );
}