import { authService } from '../services/auth.service'
import { useGlobals } from '../utils/globals'

const { apiBase } = useGlobals()
export async function getCsrfToken(): Promise<string> {
  const response = await fetch(`/csrf-token`, {
    mode: 'cors',
    signal: AbortSignal.timeout(2000),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Token was not received.')
  }

  return await response.text()
}
const unsafeMethods = ['POST', 'PUT', 'PATCH', 'DELETE']
export const fetcher = async <T>(
  input: RequestInfo | URL,
  init: RequestInit,
  showErrorMessage: (msg: string) => void
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  const isUnsafeMethod = unsafeMethods.includes(init?.method ?? '')
  if (isUnsafeMethod) {
    const csrfToken = await getCsrfToken()
    headers['X-Csrf-Token'] = csrfToken
  }
  return fetch(input, {
    headers: headers,
    credentials: 'include', // Send cookies
    ...(init ?? {}),
  }).then(async (res) => {
    const data = await res.json()
    if (res.status === 403) {
      authService.logout(apiBase)
    } else if (res.status === 500) {
      showErrorMessage(
        'Sorry, something went wrong. Please report this issue to our support team so we can investigate and resolve the problem.'
      )
      return
    } else if (!res.ok) {
      console.log(data.errorDetails)
      throw data.errorMessage
    }
    return data
  })
}
