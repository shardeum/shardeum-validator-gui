import useSWR from 'swr'
import { NodeNetwork } from '../model/node-network'
import { useGlobals } from '../utils/globals'
import { useContext } from 'react'
import { FetcherContext } from '../components/FetcherContextProvider'

type NodeNetworkResponse = {
  network: NodeNetwork | undefined
  isLoading: boolean
  isError: boolean
}

export const useNodeNetwork = (): NodeNetworkResponse => {
  const { apiBase } = useGlobals()
  const fetcher = useContext(FetcherContext)
  const { data, error } = useSWR<NodeNetwork, Error>(`${apiBase}/api/node/network`, fetcher, {
    refreshInterval: 1000,
  })

  return {
    network: data,
    isLoading: !data && !error,
    isError: !!error,
  }
}
