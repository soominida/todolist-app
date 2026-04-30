import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import queryClient from '@/lib/queryClient';
import router from '@/router';
import { useThemeStore } from '@/store/themeStore';

function ThemeProvider({ children }) {
  const isDark = useThemeStore((s) => s.isDark);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
