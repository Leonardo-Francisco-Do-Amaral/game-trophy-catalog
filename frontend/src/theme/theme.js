import { createTheme } from '@mui/material/styles';
import { deepPurple, grey } from '@mui/material/colors'; // Importando grey para o background

const theme = createTheme({
  palette: {
    mode: 'dark', // Tema escuro
    primary: {
      main: deepPurple[400], // Um roxo um pouco mais claro para a primária
      light: deepPurple[200],
      dark: deepPurple[700],
      contrastText: '#fff',
    },
    secondary: {
      main: '#82b1ff', // Um azul claro vibrante (similar ao indigo A200, bom para acentos)
      light: '#b7e3ff',
      dark: '#4c82cc',
      contrastText: '#000',
    },
    background: {
      default: grey[900], // Fundo principal da página (quase preto)
      paper: grey[800],   // Fundo para Cards, Modals, etc. (um cinza escuro)
    },
    text: {
      primary: '#fff',     // Texto principal branco
      secondary: grey[400], // Texto secundário em cinza claro
    },
    // Você pode adicionar mais cores aqui, se desejar
    // error: { main: '#f44336' },
    // warning: { main: '#ff9800' },
    // info: { main: '#2196f3' },
    // success: { main: '#4caf50' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 700,
      marginBottom: '1rem',
      color: deepPurple[200], // Cor mais clara para o título principal
    },
    h5: { // Para os títulos dos jogos nos cards
      fontWeight: 600,
      color: deepPurple[100],
    },
    body1: {
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none', // Remove a capitalização automática dos botões
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                background: grey[900], // AppBar agora combina com o background padrão
                boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)', // Sombra para destaque
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 12, // Bordas mais arredondadas para os cartões
                boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.4)', // Sombra mais proeminente
                backgroundColor: grey[800], // Usa a cor de background.paper do tema
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Transição suave
                '&:hover': {
                    transform: 'translateY(-5px)', // Leve elevação ao passar o mouse
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.6)', // Sombra maior ao passar o mouse
                },
            },
        },
    },
    MuiContainer: {
        styleOverrides: {
            root: {
                paddingTop: '2rem',    // Adiciona padding no topo
                paddingBottom: '2rem', 
            },
        },
    },
  },
});

export default theme;