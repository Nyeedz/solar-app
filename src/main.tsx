import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { appTheme } from './styles/theme/theme';
import './styles/App.scss';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <RecoilRoot>
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme />
      <App />
    </ThemeProvider>
  </RecoilRoot>
);
