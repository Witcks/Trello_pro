import { useColorScheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';

const ModeSelect = () => {
  const { mode, setMode } = useColorScheme();
  const handleChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
  };

  return (
    <FormControl
      size="small"
      sx={{ minWidth: '120px' }}>
      <InputLabel
        sx={{ color: 'white', '&.Mui-focused': { color: 'white' } }}
        id="lable-select-dark-light-mode">
        Mode
      </InputLabel>
      <Select
        labelId="lable-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
        sx={{
          color: 'white',
          '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '.MuiSvgIcon-root': { color: 'white' },
        }}>
        <MenuItem value="light">
          <Box
            sx={{
              display: 'flex',
              alignItem: 'center',
              gap: 1,
            }}>
            <LightModeIcon fontSize="small" />
            <span>Light</span>
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alignItem: 'center', gap: 1 }}>
            <DarkModeOutlinedIcon fontSize="small" />
            <span>Dark</span>
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{ display: 'flex', alignItem: 'center', gap: 1 }}>
            <SettingsBrightnessIcon fontSize="small" />
            <span>System</span>
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default ModeSelect;
