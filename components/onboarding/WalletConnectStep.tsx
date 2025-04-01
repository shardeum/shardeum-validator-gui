import { useAccount, useNetwork, useSwitchNetwork, useDisconnect } from 'wagmi'
import { CHAIN_ID } from '../../pages/_app'
import { WalletConnectButton } from '../molecules/WalletConnectButton'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface WalletConnectStepProps {
  stepNumber: number
}

export const WalletConnectStep = ({ stepNumber }: WalletConnectStepProps) => {
  const { isConnected, address } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { disconnect } = useDisconnect()

  return (
    <div className="bg-white w-full border p-3 shadow-md rounded-sm">
      {!(isConnected && chain?.id === CHAIN_ID) && (
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2 max-w-xl">
            <span className="flex items-center justify-center h-5 w-5 bg-primary rounded-full text-white text-xs">
              {stepNumber}
            </span>
            <span className="font-semibold w-full flex items-center justify-between pr-5">Connect your wallet</span>
          </div>
          <div className="flex flex-col w-full pl-7">
            <span className="font-light text-sm text-gray-600">
              Connect your wallet and switch to Shardeum Network.
            </span>
            <div className="flex flex-col mt-4 pr-5">
              <div className="flex">
                <div className="basis-0 grow text-white">
                  <WalletConnectButton label="Connect Wallet" />
                </div>
                {isConnected && chain?.id !== CHAIN_ID && (
                  <div className="basis-0 grow">
                    <button
                      className={
                        'ml-2 px-3 py-2 text-white text-sm rounded w-full ' +
                        (isConnected ? 'bg-primary' : 'bg-gray-400')
                      }
                      disabled={!isConnected}
                      onClick={() => switchNetwork?.(CHAIN_ID)}
                    >
                      Switch to Shardeum Atomium
                    </button>
                  </div>
                )}
              </div>
              {isConnected && chain?.id !== CHAIN_ID && (
                <div className="w-full flex text-xs justify-end mt-1 gap-x-1">
                  <span>Wrong wallet? </span>
                  <button
                    className="text-primary"
                    type="button"
                    onClick={() => {
                      if (disconnect) {
                        disconnect()
                      }
                    }}
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isConnected && chain?.id === CHAIN_ID && (
        <>
          <div className="flex items-center gap-x-2 max-w-xl">
            <CheckCircleIcon className="bg-white h-6 w-6 rounded-full text-xs text-green-700" />
            <span className="font-semibold flex justify-between items-center w-full pr-5">
              Successfully connected to the Shardeum Network
            </span>
          </div>
          <span className="text-gray-600 text-sm ml-8">
            {address &&
              `${address.slice(0, 4)}...
              ${address.slice(address.length - 5)} connected to the
              network`}
          </span>
        </>
      )}
    </div>
  )
}
