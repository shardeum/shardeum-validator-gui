import { useAccount } from 'wagmi'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useStake } from '../../hooks/useStake'
import { useNodeStatus } from '../../hooks/useNodeStatus'
import { GeistSans } from 'geist/font'
import { useState, useMemo, useEffect } from 'react'

interface StakeStepProps {
  stepNumber: number
}

export const StakeStep = ({ stepNumber }: StakeStepProps) => {
  const { isConnected, address } = useAccount()
  const { nodeStatus } = useNodeStatus()
  const [stakedAmount, setStakedAmount] = useState(0)
  const [isStakingComplete, setIsStakingComplete] = useState(false)
  const [isNodeStarted, setIsNodeStarted] = useState(false)

  useEffect(() => {
    if (nodeStatus?.state && nodeStatus.state !== 'stopped') {
      setIsNodeStarted(true)
    } else {
      setIsNodeStarted(false)
    }
  }, [nodeStatus?.state])

  const minimumStakeRequirement = useMemo(() => {
    return Math.max(parseFloat(nodeStatus?.stakeRequirement || '—.—') - parseFloat(nodeStatus?.lockedStake || '0'), 0)
  }, [nodeStatus?.stakeRequirement, nodeStatus?.lockedStake])

  const {
    sendTransaction,
    handleStakeChange,
    setNomineeAddress,
    isEmpty,
    isLoading: isStaking,
  } = useStake({
    nominator: address?.toString() || '',
    nominee: nodeStatus?.nomineeAddress || '',
    stakeAmount: minimumStakeRequirement.toString(),
    totalStaked: nodeStatus?.lockedStake ? Number(nodeStatus?.lockedStake) : 0,
    onStake: (wasTxnSuccessful: boolean) => {
      setIsStakingComplete(wasTxnSuccessful)
    },
  })

  useEffect(() => {
    const nomineeAddress = nodeStatus?.nomineeAddress
    if (nomineeAddress) {
      setNomineeAddress(nomineeAddress)
    }
  }, [nodeStatus?.nomineeAddress, setNomineeAddress])

  const isEnabled = isConnected && isNodeStarted

  return (
    <div className="bg-white w-full border p-3 shadow-md rounded-sm">
      {!isEnabled && (
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <span className="flex items-center justify-center bg-gray-400 h-5 w-5 rounded-full text-white text-xs">
              {stepNumber}
            </span>
            <span className="font-medium text-gray-400">Stake your SHM</span>
          </div>
        </div>
      )}
      {isEnabled && !isStakingComplete && (
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2 max-w-xl">
            <span className="flex items-center justify-center h-5 w-5 bg-primary rounded-full text-white text-xs">
              {stepNumber}
            </span>
            <span className="font-semibold w-full flex items-center justify-between pr-5">Stake your SHM</span>
          </div>
          <div className="flex flex-col w-full pl-7">
            <span className="font-light text-sm text-gray-600">Stake SHM to become a validator & earn rewards.</span>
            <div className="flex flex-col mt-4 pr-5">
              <div className="flex justify-between gap-x-2 bg-white">
                <input
                  className="basis-0 grow bg-white border border-gray-300 shadow-sm rounded px-3 py-1"
                  placeholder="10"
                  type="number"
                  step="0.00000000000000000001"
                  min={minimumStakeRequirement}
                  disabled={isStaking}
                  onChange={(e) => {
                    const amount = e.target.value
                    if (amount) {
                      setStakedAmount(parseFloat(e.target.value))
                    }
                    handleStakeChange(e)
                  }}
                />
                {!isStaking && (
                  <button
                    onClick={async () => {
                      await sendTransaction()
                    }}
                    disabled={isEmpty || stakedAmount < minimumStakeRequirement}
                    className={
                      (isEmpty || stakedAmount < minimumStakeRequirement
                        ? 'bg-gray-300'
                        : 'bg-indigo-600 hover:bg-indigo-700') +
                      ' text-white text-sm font-semibold w-32 py-2 rounded flex justify-center ease-in-out duration-300 ' +
                      GeistSans.className
                    }
                  >
                    Stake
                  </button>
                )}
                {isStaking && (
                  <button
                    className="border border-gray-300 rounded w-32 py-2 flex items-center justify-center text-sm font-medium"
                    disabled={true}
                  >
                    <div className="spinner flex items-center justify-center mr-3">
                      <div className="border-2 border-black border-b-white rounded-full h-3.5 w-3.5"></div>
                    </div>{' '}
                    Confirming
                  </button>
                )}
              </div>
              <div className="flex flex-col w-full mt-2">
                <div className="flex items-center"></div>
                <div className="flex justify-between">
                  <div className={`text-xs ${stakedAmount < minimumStakeRequirement ? 'text-dangerFg' : ''}`}>
                    <span>Minimum stake requirement: </span>
                    <span className="font-semibold">{nodeStatus?.stakeRequirement || '—.—'} SHM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEnabled && isStakingComplete && (
        <>
          <div className="flex items-center gap-x-2 max-w-xl">
            <CheckCircleIcon className="bg-white h-6 w-6 rounded-full text-xs text-green-700" />
            <span className="font-semibold flex justify-between items-center w-full pr-5">Successfully staked SHM</span>
          </div>
          <span className="text-gray-600 text-sm ml-8">You&apos;ve successfully staked {stakedAmount} SHM.</span>
        </>
      )}
    </div>
  )
}
