export type ErrorResponse = {
  errorMessage: string
  errorDetails: string
}

export interface ExecFileSyncError extends Error {
  code?: number
  killed?: boolean
  signal?: NodeJS.Signals
  cmd?: string
  stdout?: Buffer
  stderr?: Buffer
}
