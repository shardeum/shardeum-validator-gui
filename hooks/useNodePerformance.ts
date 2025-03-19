import useSWR from 'swr'
import { NodePerformance } from '../model/node-performance'
import { useGlobals } from '../utils/globals'
import { useContext } from 'react'
import { FetcherContext } from '../components/FetcherContextProvider'

type NodePerformanceResult = {
  performance: NodePerformance[] | undefined
  isLoading: boolean
  isError: boolean
}

export const useNodePerformance = (): NodePerformanceResult => {
  const { apiBase } = useGlobals()
  const fetcher = useContext(FetcherContext)
  const { data, error } = useSWR<NodePerformance[], Error>(`${apiBase}/api/node/performance`, fetcher)

  return {
    performance: data,
    isLoading: !data && !error,
    isError: !!error,
  }
}
