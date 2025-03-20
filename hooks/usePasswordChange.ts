import { fetcher } from './fetcher'
import { useGlobals } from '../utils/globals'
import { useState } from 'react'
import { hashSha256 } from '../utils/sha256-hash'
import { showErrorMessage, showSuccessMessage } from './useToastStore'

type usePasswordInput = {
  setError?: (field: any, errorData: any, options: any) => void
}

export type ChangePasswordResult = {
  isLoading: boolean
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

export const usePassword = ({ setError }: usePasswordInput): ChangePasswordResult => {
  const { apiBase } = useGlobals()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    setIsLoading(true)
    if (currentPassword === newPassword) {
      showErrorMessage('The new password must differ from the existing password.')
      setIsLoading(false)
      return
    }
    try {
      const currentPwSha256digest = await hashSha256(currentPassword)
      const newPwSha256digest = await hashSha256(newPassword)
      await fetcher(
        `${apiBase}/api/password`,
        {
          method: 'POST',
          body: JSON.stringify({ currentPassword: currentPwSha256digest, newPassword: newPwSha256digest }),
        },
        showErrorMessage
      )
      showSuccessMessage('Password changed successfully!')
    } catch (e) {
      console.error(e)
      if (typeof e === 'string') {
        if (setError) {
          setError('root', { message: e }, { shouldFocus: true })
        }
      }
    }
    setIsLoading(false)
  }

  return {
    isLoading,
    changePassword,
  }
}
