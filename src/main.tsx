import ReactDOM from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast'
import theme from './theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
    <Toaster position="top-right" />
  </ThemeProvider>,
)
