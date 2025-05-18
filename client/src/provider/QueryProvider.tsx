import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type QueryProviderProps = {
  children: ReactNode;
};
function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default QueryProvider;
