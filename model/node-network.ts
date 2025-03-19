export interface NodeNetwork {
  active: number
  standby: number
  desired: number
  syncing: number
  load: number
  nodeLoad: { internal: number; external: number }
  txApplied: number
  txExpired: number
  txInjected: number
  txProcessed: number
  txRejected: number
  joining?: number
}
