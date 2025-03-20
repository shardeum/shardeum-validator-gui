import { fetcher } from './fetcher'
import { useGlobals } from '../utils/globals'
import { showErrorMessage } from './useToastStore'

type TXLogsResponse = {
  writeUnstakeLog: Function
  writeStakeLog: Function
}

export const useTXLogs = (): TXLogsResponse => {
  const { apiBase } = useGlobals()
  const writeStakeLog = async (data: string): Promise<void> => {
    try {
      await fetcher(
        `${apiBase}/api/log/stake`,
        {
          method: 'POST',
          body: data,
        },
        showErrorMessage
      )
    } catch (e) {
      console.error(e)
    }
  }

  const writeUnstakeLog = async (data: string): Promise<void> => {
    try {
      await fetcher(
        `${apiBase}/api/log/unstake`,
        {
          method: 'POST',
          body: data,
        },
        showErrorMessage
      )
    } catch (e) {
      console.error(e)
    }
  }

  return {
    writeUnstakeLog,
    writeStakeLog,
  }
}
