import { useAccount, useNetwork } from 'wagmi'
import { CHAIN_ID } from '../../pages/_app'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { FAUCET_CLAIM_DOCS_URL } from '../../pages/onboarding'
import { useEffect, useState } from 'react'

interface ClaimTokensStepProps {
  stepNumber: number
}

export const ClaimTokensStep = ({ stepNumber }: ClaimTokensStepProps) => {
  const { isConnected, address } = useAccount()
  const { chain } = useNetwork()
  const [tokenClaimPhase, setTokenClaimPhase] = useState(0)
  const [accountBalance, setAccountBalance] = useState('')

  useEffect(() => {
    const claimantAddress = localStorage.getItem('tokensClaimedBy')
    setTokenClaimPhase(claimantAddress === address ? 2 : 0)
  }, [address])

  return (
    <div className="bg-white w-full border p-3 shadow-md rounded-sm">
      {isConnected && chain?.id === CHAIN_ID && tokenClaimPhase < 2 && (
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2 max-w-xl">
            <span className="flex items-center justify-center h-5 w-5 bg-primary rounded-full text-white text-xs">
              {stepNumber}
            </span>
            <span className="font-semibold w-full flex items-center justify-between pr-5">
              Claim testnet tokens from faucet
            </span>
          </div>
          <div className="flex flex-col w-full pl-7">
            <span className="text-gray-600 text-sm">Claim SHM tokens from Shardeum faucet as a reward.</span>
            <div className="flex flex-col mt-4 pr-5">
              {tokenClaimPhase === 0 && (
                <div className="flex">
                  <div className="basis-0 grow">
                    <button
                      className={
                        'px-3 py-2 text-white text-sm font-semibold rounded w-full ' +
                        (isConnected ? 'bg-primary' : 'bg-gray-400')
                      }
                      disabled={!isConnected}
                      onClick={() => {
                        if (window) {
                          window.open(FAUCET_CLAIM_DOCS_URL, '_blank')
                        }
                        setTokenClaimPhase(2)
                      }}
                    >
                      Claim SHM
                    </button>
                  </div>
                  <div className="basis-0 grow ml-2">
                    <button
                      className={
                        'ml-2 px-3 py-2 text-primary text-sm font-semibold rounded w-full bg-white border border-gray-300'
                      }
                      disabled={!isConnected}
                      onClick={() => {
                        localStorage.setItem('tokensClaimedBy', address || '')
                        setTokenClaimPhase(2)
                      }}
                    >
                      I already have SHM to stake
                    </button>
                  </div>
                </div>
              )}
              {tokenClaimPhase === 1 && (
                <button
                  className="mt-2 border border-gray-300 rounded w-full px-4 py-2 flex items-center justify-center text-sm font-medium"
                  disabled={true}
                >
                  <div className="spinner flex items-center justify-center mr-3">
                    <div className="border-2 border-black border-b-white rounded-full h-3.5 w-3.5"></div>
                  </div>{' '}
                  Claiming SHM
                </button>
              )}
              {accountBalance !== '' && (
                <div className="w-full flex text-xs justify-end mt-1 gap-x-1">
                  <span>Balance: </span>
                  <span className="font-semibold">{accountBalance}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isConnected && chain?.id === CHAIN_ID && tokenClaimPhase === 2 && (
        <>
          <div className="flex items-center gap-x-2">
            <CheckCircleIcon className="bg-white h-6 w-6 rounded-full text-xs text-green-700" />
            <span className="font-semibold flex justify-between items-center w-full pr-5">
              Successfully claimed SHM
            </span>
          </div>
          <span className="text-gray-600 text-sm ml-8">You&apos;ve successfully claimed your reward SHM tokens.</span>
        </>
      )}
      {!(isConnected && chain?.id === CHAIN_ID) && (
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <span className="flex items-center justify-center bg-gray-400 h-5 w-5 rounded-full text-white text-sm">
              {stepNumber}
            </span>
            <span className="font-medium text-gray-400">Claim testnet tokens from faucet</span>
          </div>
        </div>
      )}
    </div>
  )
}
