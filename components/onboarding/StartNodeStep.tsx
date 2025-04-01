import { useState, useEffect } from 'react'
import { useNodeStatus } from '../../hooks/useNodeStatus'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useAccount } from 'wagmi'
import { useTokenClaimPhase } from '../../hooks/useTokenClaimPhase'

interface StartNodeStepProps {
  stepNumber: number
}

export const StartNodeStep = ({ stepNumber }: StartNodeStepProps) => {
  const { nodeStatus, isLoading, startNode } = useNodeStatus()
  const [isNodeStarted, setIsNodeStarted] = useState(false)
  const { isConnected } = useAccount()
  const { tokenClaimPhase } = useTokenClaimPhase()

  useEffect(() => {
    if (nodeStatus?.state && nodeStatus.state !== 'stopped') {
      setIsNodeStarted(true)
    } else {
      setIsNodeStarted(false)
    }
  }, [nodeStatus?.state])

  const isEnabled = isConnected && (tokenClaimPhase === -1 || tokenClaimPhase === 2)

  return (
    <div className="bg-white w-full border p-3 shadow-md rounded-sm">
      {!isEnabled && (
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <span className="flex items-center justify-center bg-gray-400 h-5 w-5 rounded-full text-white text-xs">
              {stepNumber}
            </span>
            <span className="font-medium text-gray-400">Start your node</span>
          </div>
        </div>
      )}
      {isEnabled && !isNodeStarted && (
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2 max-w-xl">
            <span className="flex items-center justify-center h-5 w-5 bg-primary rounded-full text-white text-xs">
              {stepNumber}
            </span>
            <span className="font-semibold w-full flex items-center justify-between pr-5">Start your node</span>
          </div>
          <div className="flex flex-col w-full pl-7">
            <span className="font-light text-sm text-gray-600">
              Start your node to be a part of the validation network.
            </span>
            <div className="flex flex-col mt-4 pr-5">
              <div className="flex">
                {!isLoading && (
                  <button
                    className="w-full bg-primary text-white text-sm px-4 py-2 rounded-sm mb-1"
                    onClick={async () => {
                      await startNode()
                      setIsNodeStarted(true)
                    }}
                  >
                    Start Node
                  </button>
                )}
                {isLoading && (
                  <button
                    className="border border-gray-300 rounded w-full px-4 py-2 flex items-center justify-center text-sm font-medium"
                    disabled={true}
                  >
                    <div className="spinner flex items-center justify-center mr-3">
                      <div className="border-2 border-black border-b-white rounded-full h-3.5 w-3.5"></div>
                    </div>{' '}
                    Starting Node
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {isEnabled && isNodeStarted && (
        <>
          <div className="flex items-center gap-x-2 max-w-xl">
            <CheckCircleIcon className="bg-white h-6 w-6 rounded-full text-xs text-green-700" />
            <span className="font-semibold flex justify-between items-center w-full pr-5">
              Node initiated successfully.
            </span>
          </div>
          <span className="text-gray-600 text-sm ml-8">Your node has been started and is waiting for stake</span>
        </>
      )}
    </div>
  )
}
