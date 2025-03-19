interface EthersError {
  code: EthersErrorCode
  error: Error
}

export type EthersErrorCode =
  | 'UNKNOWN_ERROR'
  | 'NOT_IMPLEMENTED'
  | 'UNSUPPORTED_OPERATION'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'TIMEOUT'
  | 'BAD_DATA'
  | 'CANCELLED'
  | 'BUFFER_OVERRUN'
  | 'NUMERIC_FAULT'
  | 'INVALID_ARGUMENT'
  | 'MISSING_ARGUMENT'
  | 'UNEXPECTED_ARGUMENT'
  | 'VALUE_MISMATCH'
  | 'CALL_EXCEPTION'
  | 'INSUFFICIENT_FUNDS'
  | 'NONCE_EXPIRED'
  | 'REPLACEMENT_UNDERPRICED'
  | 'TRANSACTION_REPLACED'
  | 'UNCONFIGURED_NAME'
  | 'OFFCHAIN_FAULT'
  | 'ACTION_REJECTED'

export function isEthersError(error: unknown): error is EthersError {
  return (error as EthersError)?.code != null && typeof (error as EthersError).code === 'string'
}
