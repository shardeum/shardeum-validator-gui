interface MetaMaskError {
  code: number
  message: string
  stack: string
}

export function isMetaMaskError(error: unknown): error is MetaMaskError {
  return (error as MetaMaskError)?.code != null && typeof (error as MetaMaskError).code === 'number'
}
