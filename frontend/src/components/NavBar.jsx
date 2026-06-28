import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  Group,
  Add,
  History,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';

const NavBar = () => {
  const theme = useTheme();
  const { isDark, toggleDarkMode } = useDarkMode();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Dashboard /> },
    { path: '/users', label: 'Users', icon: <Group /> },
    { path: '/add', label: 'Add User', icon: <Add /> },
    { path: '/activity', label: 'Activity', icon: <History /> },
  ];

  return (
    <AppBar position="static" elevation={0} sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          CRUD-CORE 
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={NavLink}
              to={item.path}
              color="inherit"
              startIcon={item.icon}
              sx={{
                '&.active': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
          <IconButton onClick={toggleDarkMode} color="inherit">
            {isDark ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
