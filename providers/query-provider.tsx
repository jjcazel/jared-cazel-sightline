'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 min
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        gcTime: 1000 * 60 * 30, // 30 min
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  const isDevMode = process.env.NODE_ENV === 'development';

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDevMode && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

