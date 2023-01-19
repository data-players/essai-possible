import { createTheme } from '@material-ui/core/styles';
import theme from './config/theme';

// Allow to use breakpoints
const defaultTheme = createTheme();

//Change this color to change AppBar color
const primary = '#aaaaaa';


let customTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    primary: {
      ...theme.palette.primary,
      main: primary,
    }
  },
});

export default customTheme;
