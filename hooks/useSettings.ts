import useSWR, { KeyedMutator } from 'swr'
import { fetcher } from './fetcher'
import { useGlobals } from '../utils/globals'
import { ToastContext } from '../components/ToastContextProvider'
import { useContext, useState } from 'react'

export type NodeSettings = {
  autoRestart: boolean
  lastStopped?: number
}

export type SettingsResult = {
  settings: NodeSettings | undefined
  isLoading: boolean
  updateSettings: (settings: NodeSettings) => Promise<void>
  mutate: KeyedMutator<NodeSettings>
}

export const useSettings = (): SettingsResult => {
  const { apiBase } = useGlobals()
  const { data, mutate } = useSWR<NodeSettings>(`${apiBase}/api/settings`, fetcher)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { showErrorMessage } = useContext(ToastContext)

  async function updateSettings(settings: NodeSettings): Promise<void> {
    setIsLoading(true)
    try {
      const newSettings = await fetcher<NodeSettings>(
        `${apiBase}/api/settings`,
        { method: 'POST', body: JSON.stringify(settings) },
        showErrorMessage
      )
      await mutate(newSettings)
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  return {
    settings: data,
    isLoading,
    updateSettings,
    mutate,
  }
}
