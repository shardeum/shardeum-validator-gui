import { httpOrHttps } from './is-dev'

export function useGlobals() {
  return {
    apiBase: `${httpOrHttps()}://${globalThis.window?.location.host}`,
  }
}
