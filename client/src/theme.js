import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#28a745',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#333333',
    },
    background: {
      default: '#f0f9ff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: 'none' },
      },
    },
  },
})

export default theme

