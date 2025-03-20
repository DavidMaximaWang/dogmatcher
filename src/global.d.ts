import { QueryClient } from '@tanstack/react-query';

declare global {
  // eslint-disable-next-line no-var
  var queryClient: QueryClient;
}