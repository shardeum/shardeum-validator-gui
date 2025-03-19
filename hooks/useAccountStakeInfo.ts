import useSWR from 'swr'
import { AccountStakeInfo } from '../model/account-stake-info'
import { useGlobals } from '../utils/globals'
import { useContext } from 'react'
import { FetcherContext } from '../components/FetcherContextProvider'

type AccountStakeInfoResponse = {
  stakeInfo: AccountStakeInfo | undefined
  isLoading: boolean
  isError: boolean
}

export const useAccountStakeInfo = (eoa?: string): AccountStakeInfoResponse => {
  const { apiBase } = useGlobals()
  const fetcher = useContext(FetcherContext)
  const { data, error } = useSWR<AccountStakeInfo, Error>(
    eoa != null ? `${apiBase}/api/account/${eoa}/stakeInfo` : null,
    fetcher,
    { refreshInterval: 1000 }
  )

  return {
    stakeInfo: data,
    isLoading: !data && !error,
    isError: !!error,
  }
}
