
import { QueryClient } from '@tanstack/react-query';

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

if (process.env.NODE_ENV === 'test') {
    console.error = () => {};
    console.warn = () => {};
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            staleTime: 1000 * 60 * 5
        }
    }
});

beforeAll(() => {
    globalThis.queryClient = queryClient;
});

afterEach(() => {
    globalThis.queryClient.cancelQueries();
    globalThis.queryClient.clear();
});

afterAll(() => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).queryClient = undefined;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
});
