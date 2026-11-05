import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { SmoothScrollProvider } from './context/SmoothScrollContext';
import { ToastContainer } from './components/common/ToastContainer';
import { SoundEffects } from './components/common/SoundEffects';
import { AppRouter } from './routes/AppRouter';

try {
  const ref = new URLSearchParams(window.location.search).get('ref');
  if (ref) localStorage.setItem('compute50_referral', ref);
} catch {

}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
              <SmoothScrollProvider>
                <SoundEffects />
                <AppRouter />
              </SmoothScrollProvider>
            </BrowserRouter>
            <ToastContainer />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;