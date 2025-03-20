import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { FullPageErrorFallback } from './lib/index.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary fallbackRender={FullPageErrorFallback}>
            <AuthProvider>
                <BrowserRouter>
                    <QueryClientProvider client={queryClient}>
                        <App />
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </BrowserRouter>
            </AuthProvider>
        </ErrorBoundary>
    </StrictMode>
);


