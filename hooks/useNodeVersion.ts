import useSWR from 'swr'
import { fetcher } from './fetcher'
import { NodeVersion } from '../model/node-version'
import { useGlobals } from '../utils/globals'
import { useContext } from 'react'
import { FetcherContext } from '../components/FetcherContextProvider'
import { showErrorMessage } from './useToastStore'

type NodeVersionResult = {
  isLoading: boolean
  isError: boolean
  update: () => Promise<Response>
  version: NodeVersion | undefined
}

let data: NodeVersion | undefined
let error: Error | undefined
let lastFetchedAt: Date

export const useNodeVersion = (isPublic: boolean = false): NodeVersionResult => {
  const { apiBase } = useGlobals()
  const fetcherWithContext = useContext(FetcherContext)

  let hasExpired = true
  if (lastFetchedAt) {
    hasExpired = lastFetchedAt.getTime() - new Date().getTime() >= 1000 * 3600 * 24 * 2 // gte 2 days
  }
  let shouldFetchVersion = !data || hasExpired

  const publicVersion = useSWR<NodeVersion, Error>(
    shouldFetchVersion && isPublic ? `${apiBase}/node/version` : null,
    fetcherWithContext
  )
  if (shouldFetchVersion && isPublic && !publicVersion.error) {
    data = publicVersion.data
    lastFetchedAt = new Date()
  }
  error = publicVersion.error

  const authVersion = useSWR<NodeVersion, Error>(
    shouldFetchVersion && !isPublic ? `${apiBase}/api/node/version` : null,
    fetcherWithContext
  )
  if (shouldFetchVersion && !isPublic && !authVersion.error) {
    data = authVersion.data
    lastFetchedAt = new Date()
  }
  error = authVersion.error

  const update = (): Promise<Response> => {
    return fetcher<Response>(`${apiBase}/api/node/update`, { method: 'POST' }, showErrorMessage)
  }

  return {
    version: data,
    isLoading: !data && !error,
    isError: !!error,
    update,
  }
}
