import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lightTheme, darkTheme } from './theme';
import { useDarkMode } from './hooks/useDarkMode';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import AllUsers from './pages/AllUsers';
import AddUser from './pages/AddUser';
import EditUser from './pages/EditUser';
import ActivityHistory from './pages/ActivityHistory';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  const { isDark } = useDarkMode();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <CssBaseline />
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<AllUsers />} />
            <Route path="/add" element={<AddUser />} />
            <Route path="/edit/:id" element={<EditUser />} />
            <Route path="/activity" element={<ActivityHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
