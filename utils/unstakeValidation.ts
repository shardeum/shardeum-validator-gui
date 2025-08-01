import { NodeStatus } from '../model/node-status'

export interface UnstakeValidationResult {
  canUnstake: boolean
  errorMessage?: string
}

export const validateUnstakeEligibility = (
  force: boolean,
  nodeStatus: NodeStatus | null | undefined
): UnstakeValidationResult => {
  if (!force && nodeStatus?.stakeState && !nodeStatus.stakeState.unlocked) {
    const remainingMinutes = Math.ceil(nodeStatus.stakeState.remainingTime / 60000)
    return {
      canUnstake: false,
      errorMessage: `Cannot unstake: ${nodeStatus.stakeState.reason} Please wait ${remainingMinutes} more minutes before attempting to unstake.`
    }
  }

  return {
    canUnstake: true
  }
}