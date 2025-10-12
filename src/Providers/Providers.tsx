"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ProgressBar from "./ProgressBar";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ProgressBar />
      <Toaster richColors position="top-center" />
      {children}
    </QueryClientProvider>
  );
}
