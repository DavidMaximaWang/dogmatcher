import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import './index.css';
import { FullPageErrorFallback } from './lib/index.tsx';
import { disableConsoleErrorsInProduction } from './utils/logging';

disableConsoleErrorsInProduction();

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary fallbackRender={FullPageErrorFallback}>
            <QueryClientProvider client={queryClient}>
                <HashRouter>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </HashRouter>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ErrorBoundary>
    </StrictMode>
);


