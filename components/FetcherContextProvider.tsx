// FetcherContext.tsx
import React, { createContext, ReactNode } from 'react'
import { fetcher } from '../hooks/fetcher'
import { showErrorMessage } from '../hooks/useToastStore'

export const FetcherContext = createContext<typeof fetcher | null>(null)

export default function FetcherContextProvider({ children }: { children: ReactNode }) {
  function fetcherWithContext<T>(input: RequestInfo | URL, init: RequestInit): Promise<T> {
    return fetcher(input, init, showErrorMessage)
  }

  return <FetcherContext.Provider value={fetcherWithContext}>{children}</FetcherContext.Provider>
}
