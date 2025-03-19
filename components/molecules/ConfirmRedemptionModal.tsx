import { XMarkIcon } from '@heroicons/react/24/outline'
import useModalStore from '../../hooks/useModalStore'
import { useUnstake } from '../../hooks/useUnstake'
import { RedemptionSuccessModal } from './RedemptionSuccessModal'
import { MobileModalWrapper } from '../layouts/MobileModalWrapper'
import { useEffect } from 'react'
import useToastStore, { ToastSeverity } from '../../hooks/useToastStore'

type ConfirmRedemptionModalProps = {
  nominator: string
  nominee: string
  currentRewards: number
  currentStake: number
}

export const ConfirmRedemptionModal = ({
  nominator,
  nominee,
  currentRewards,
  currentStake,
}: ConfirmRedemptionModalProps) => {
  const { setShowModal, setContent, resetModal } = useModalStore((state: any) => ({
    setShowModal: state.setShowModal,
    setContent: state.setContent,
    resetModal: state.resetModal,
  }))
  const { handleRemoveStake, isLoading } = useUnstake({
    nominator,
    nominee,
    force: false,
  })

  const { setCurrentToast } = useToastStore((state: any) => ({
    setCurrentToast: state.setCurrentToast,
  }))

  useEffect(() => {
    if (isLoading) {
      setCurrentToast({
        severity: ToastSeverity.LOADING,
        title: 'Redeeming rewards...',
        description: 'Your reward redemption transaction is in process.',
      })
    }
  }, [isLoading])

  return (
    <div className="bg-white text-subtleFg flex flex-col p-4 max-w-lg w-full gap-y-3 rounded">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-subtleFg text-lg">Confirm Redemption</span>
        <XMarkIcon
          className="h-3 w-3 cursor-pointer"
          onClick={() => {
            resetModal()
          }}
        />
      </div>
      <span className="break-words bodyFg text-sm leading-5 max-w-md">
        By claiming your reward redemption you will be unstaking SHM. Here&apos;s the breakdown of the total amount:
      </span>
      <hr className="my-2" />
      <div className="flex flex-col">
        <div className="flex justify-between">
          <span className="bodyFg text-sm">Total unstake amount</span>
          <span className="text-sm font-semibold">{(currentRewards + currentStake).toFixed(2)} SHM</span>
        </div>
        <div className="flex justify-end w-full">
          <span className="bodyFg text-sm">
            ({currentRewards.toFixed(2)} Rewards + {currentStake.toFixed(2)} Stake)
          </span>
        </div>
      </div>
      <hr className="my-1" />
      <div className="flex justify-end gap-x-2 mt-2">
        {isLoading && (
          <button
            className="text-sm px-3 py-2 border border-bodyFg rounded max-w-[12rem] w-full flex items-center justify-center font-medium"
            disabled={true}
          >
            <div className="spinner flex items-center justify-center mr-3">
              <div className="border-2 border-black border-b-white rounded-full h-3.5 w-3.5"></div>
            </div>{' '}
            Confirming
          </button>
        )}
        {!isLoading && (
          <>
            <button
              className="text-primary text-sm px-3 py-2 border border-bodyFg rounded max-w-[12rem] w-full"
              onClick={() => {
                resetModal()
              }}
            >
              Don&apos;t Unstake
            </button>
            <button
              className="text-sm px-3 py-2 border border-bodyFg rounded max-w-[12rem] w-full text-primary"
              onClick={async () => {
                const wasRedemptionSuccessful = await handleRemoveStake()
                resetModal()
                if (wasRedemptionSuccessful) {
                  setTimeout(() => {
                    setContent(
                      <MobileModalWrapper closeButtonRequired={false} contentOnTop={false}>
                        <RedemptionSuccessModal stake={currentStake} rewards={currentRewards} />
                      </MobileModalWrapper>
                    )
                    setShowModal(true)
                  }, 1000)
                }
              }}
            >
              Unstake & Claim
            </button>
          </>
        )}
      </div>
    </div>
  )
}
