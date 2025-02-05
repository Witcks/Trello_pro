// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '~/App.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from '~/theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmProvider } from 'material-ui-confirm';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <CssVarsProvider theme={theme}>
    <ConfirmProvider defaultOptions={{
      dialogProps: {
        maxWidth: 'xs',
      },
      confirmationButtonProps: {
        variant: 'contained',
        color: 'error',
      },
      cancellationButtonProps: {
        variant: 'contained',
        color: 'primary',
      },
      buttonOrder: ['confirm', 'cancel'],
    }}>
      <CssBaseline />
      <App />
      <ToastContainer position="bottom-left" theme="colored" />
    </ConfirmProvider>
  </CssVarsProvider>
  // </StrictMode>
);
