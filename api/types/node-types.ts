import { ErrorResponse } from './error'

export type NodeStatus = {
  state: 'active' | 'standby' | 'stopped'
  exitStatus: 'Exit with warning' | 'Exited cleanly' | 'Exit with error'
  exitMessage: string
  totalTimeValidating: number
  lastActive: string
  lockedStake: string
  stakeAddress: string
  stakeRequirement: string
  nominatorAddress: string
  currentRewards: string
  lastPayout: string
  lifetimeEarnings: string
  stakeState?: {
    reason: string
    remainingTime: number
    unlocked: boolean
  }
  stakeable?: {
    reason: string
    remainingTime: number
    restakeAllowed: boolean
  }
  nodeInfo: {
    externalIp: string
    externalPort: number
    internalPort: number
    publicKey: string
  }
}

export type NodeLogsResponse = string[] | ErrorResponse
export type NodeStatusResponse = NodeStatus | ErrorResponse

type LogsCleared = {
  logsCleared: string[]
}

export type NodeClearLogsResponse = LogsCleared | ErrorResponse

type NodeStatusHistory = {
  state: string
  stakeAmount: string
  lifetimeEarnings: string
  date: string
}

export type NodeStatusHistoryResponse = NodeStatusHistory | ErrorResponse

type NodeVersion = {
  runningVersion: string
  minimumVersion: string
  latestVersion: string
}

export type NodeVersionResponse = NodeVersion | ErrorResponse

type NodePerformance = {
  cpu: number
  ram: number
  disk: number
  network: number
  tpsThroughput: number
  transactionsCount: number
  stateStorage: number
  date: string
}

export type NodePerformanceResponse = NodePerformance | ErrorResponse

type NodeNetwork = {
  size: {
    active: number
    standBy: number
    desired: number
    syncing: number
  }
  load: {
    maxTps: number
    avgTps: number
    totalProcessed: number
  }
  health: {
    activeStandbyRatio: number
    desiredActiveStandbyRatio: number
  }
  reward: {
    dailyIssuance: string
    avgPerDay: string
    avgPerNodeDay: string
  }
  apr: {
    nodeApr: number
    avgApr: number
  }
}

export type NodeNetworkResponse = NodeNetwork | ErrorResponse

type NodeNotification = {
  date: string
  title: string
  content: string
}

export type NotificationResponse = NodeNotification[] | ErrorResponse

type Settings = {
  rewardWalletAddress: string
  stakeWalletAddress: string
  alertEmail: string
  alertPhoneNumber: string
}

export type SettingsResponse = Settings | ErrorResponse

export type StakeRequest = {
  amount: string
}

export type NodeSettings = {
  autoRestart: boolean
  lastStopped: number
}