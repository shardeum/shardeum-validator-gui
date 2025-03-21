import { useEffect, useMemo, useRef, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { GeistSans } from 'geist/font'
import { useAccount, useBalance } from 'wagmi'
import { useNodeStatus } from '../../hooks/useNodeStatus'
import { useStake } from '../../hooks/useStake'
import useModalStore from '../../hooks/useModalStore'
import useToastStore, { ToastSeverity } from '../../hooks/useToastStore'
import { NotificationSeverity, NotificationType } from '../../hooks/useNotificationsStore'
import { CHAIN_ID } from '../../pages/_app'
import { ethers } from 'ethers'

export const AddStakeModal = () => {
  const { resetModal } = useModalStore((state: any) => ({
    resetModal: state.resetModal,
  }))
  const { setCurrentToast, resetToast } = useToastStore((state: any) => ({
    setCurrentToast: state.setCurrentToast,
    resetToast: state.resetToast,
  }))

  const stakeInputId = 'stakeInput'

  const { address } = useAccount()
  const { data } = useBalance({
    address,
    chainId: CHAIN_ID,
    formatUnits: 'ether',
  })
  const { nodeStatus } = useNodeStatus()
  const stakeInputRef = useRef<HTMLInputElement>(null)
  const [stakedAmount, setStakedAmount] = useState(0)
  const minimumStakeRequirement = useMemo(() => {
    return Math.max(parseFloat(nodeStatus?.stakeRequirement || '10') - parseFloat(nodeStatus?.lockedStake || '0'), 0)
  }, [nodeStatus?.stakeRequirement, nodeStatus?.lockedStake])
  const [balanceData, setBalanceData] = useState<{ formatted: string; symbol: string } | null>(null)

  const { sendTransaction, handleStakeChange, setNomineeAddress, isEmpty, isLoading } = useStake({
    nominator: address?.toString() || '',
    nominee: nodeStatus?.nomineeAddress || '',
    stakeAmount: minimumStakeRequirement.toString(),
    totalStaked: nodeStatus?.lockedStake ? Number(nodeStatus?.lockedStake) : 0,
    onStake: (wasTxnSuccessful: boolean) => {
      resetToast()
      if (wasTxnSuccessful) {
        setCurrentToast({
          severity: ToastSeverity.SUCCESS,
          title: 'Stake Added',
          description: `${stakedAmount.toFixed(2)} SHM staked Successfully`,
          followupNotification: {
            title: 'Stake Added',
            type: NotificationType.REWARD,
            severity: NotificationSeverity.SUCCESS,
          },
        })
      } else {
        setCurrentToast({
          severity: ToastSeverity.DANGER,
          title: 'Staking Unsuccessful',
          followupNotification: {
            title: 'Staking Unsuccessful',
            type: NotificationType.REWARD,
            severity: NotificationSeverity.DANGER,
          },
        })
      }
    },
  })

  useEffect(() => {
    const nomineeAddress = nodeStatus?.nomineeAddress
    if (nomineeAddress) {
      setNomineeAddress(nomineeAddress)
    }
  }, [nodeStatus?.nomineeAddress, setNomineeAddress])

  useEffect(() => {
    if (isLoading) {
      setCurrentToast({
        severity: ToastSeverity.LOADING,
        title: 'Processing Adding Stake',
        description: 'Your add stake transaction is in process.',
      })
    }
  }, [isLoading])

  useEffect(() => {
    const fetchCustomBalance = async () => {
      if (address && window.ethereum) {
        try {
          // Use wallet provider to get balance from the active network
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const balance = await provider.getBalance(address)
          setBalanceData({
            formatted: ethers.utils.formatEther(balance),
            symbol: 'SHM',
          })
        } catch (error) {
          console.error('Error fetching balance:', error)
          // Fall back to wagmi balance if custom fetch fails
          if (data) {
            setBalanceData({
              formatted: data.formatted,
              symbol: data.symbol,
            })
          }
        }
      }
    }

    fetchCustomBalance()
  }, [address, data])

  return (
    <>
      {nodeStatus?.nomineeAddress && (
        <div className="bg-white text-subtleFg flex flex-col p-4 md:max-w-lg max-h-48 w-full rounded gap-y-2">
          <div className="flex justify-between">
            <span className="font-semibold text-subtleFg text-lg">Add Stake</span>
            <XMarkIcon
              className="h-3 w-3 cursor-pointer"
              onClick={() => {
                if (stakeInputRef.current) {
                  stakeInputRef.current.value = ''
                }
                resetModal()
              }}
            />
          </div>
          <div
            className={
              'flex items-center py-2 px-3 rounded-md border border-b-2 bg-white ' +
              (isEmpty ? '' : 'border-b-indigo-500')
            }
          >
            <input
              type="number"
              step="0.00000000000000000001"
              min={minimumStakeRequirement}
              id={stakeInputId}
              ref={stakeInputRef}
              placeholder="10"
              className="outline-none flex-1 bg-white"
              disabled={isLoading}
              onChange={(e) => {
                const amount = e.target.value
                if (amount) {
                  const trunc = (num: string, pres: number) => {
                    const split = num.split('.')
                    return split.length > 1 ? split[0] + '.' + split[1].substring(0, pres) : num
                  }
                  setStakedAmount(parseFloat(trunc(amount, 15)))
                }
                handleStakeChange(e)
              }}
            />
          </div>
          <div className="flex flex-col w-full mt-2">
            <div className="flex items-center"></div>
            <div className="flex justify-between">
              <div className={'text-xs ' + (stakedAmount < minimumStakeRequirement ? 'text-dangerFg' : 'text-black')}>
                <span>Minimum stake requirement: </span>
                <span className="font-semibold">{nodeStatus?.stakeRequirement || '10'} SHM</span>
              </div>
              {(balanceData || data) && (
                <div className="text-xs">
                  <span>Balance: </span>
                  <span className="font-semibold">{`${balanceData?.formatted || data?.formatted} ${
                    balanceData?.symbol || data?.symbol
                  }`}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full">
            {!isLoading && (
              <button
                disabled={isEmpty || stakedAmount < minimumStakeRequirement}
                className={
                  (isEmpty || stakedAmount < minimumStakeRequirement
                    ? 'bg-gray-300'
                    : 'bg-indigo-600 hover:bg-indigo-700') +
                  ' text-white text-sm font-semibold py-2 px-4 rounded-md flex justify-center ease-in-out duration-300 w-full ' +
                  GeistSans.className
                }
                onClick={async () => {
                  await sendTransaction()
                  resetModal()
                }}
              >
                Stake
              </button>
            )}
            {isLoading && (
              <button
                className="mt-2 border border-gray-300 rounded w-full px-4 py-2 flex items-center justify-center text-sm font-medium"
                disabled={true}
              >
                <div className="spinner flex items-center justify-center mr-3">
                  <div className="border-2 border-black border-b-white rounded-full h-3.5 w-3.5"></div>
                </div>{' '}
                Confirming
              </button>
            )}
          </div>
        </div>
      )}
      {!nodeStatus?.nomineeAddress && (
        <div role="status" className="bg-white p-5 rounded">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </>
  )
}
