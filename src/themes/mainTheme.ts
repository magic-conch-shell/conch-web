import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';
import { ThemeTypes } from '../components/AppContainer/AppContainer';

const mainTheme = (type: ThemeTypes) => {
  const typeString = type === ThemeTypes.LIGHT ? 'light' : 'dark';
  const theme = createMuiTheme({
    palette: {
      type: typeString,
      primary: {
        main: purple[300],
      },
      secondary: pink,
      error: red,
      contrastThreshold: 3,
      tonalOffset: 0.2,
    },
    typography: {
      useNextVariants: true,
    },
  });
  return theme;
};

export { mainTheme, ThemeTypes };
