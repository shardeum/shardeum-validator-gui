import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import useModalStore from '../../hooks/useModalStore'
import { useUnstake } from '../../hooks/useUnstake'
import { ForceUnstakeSuccessModal } from './ForceUnstakeSuccessModal'
import { MobileModalWrapper } from '../layouts/MobileModalWrapper'
import { useDevice } from '../../context/device'
import { UnstakeSuccessModal } from './UnstakeSuccessModal'
import { useEffect } from 'react'
import useToastStore, { ToastSeverity } from '../../hooks/useToastStore'

type ConfirmUnstakeModalProps = {
  nominator: string
  nominee: string
  isNormalUnstake: boolean
  currentRewards: number
  currentStake: number
}

export const ConfirmUnstakeModal = ({
  nominator,
  nominee,
  isNormalUnstake,
  currentRewards,
  currentStake,
}: ConfirmUnstakeModalProps) => {
  const { setShowModal, setContent, resetModal } = useModalStore((state: any) => ({
    setShowModal: state.setShowModal,
    setContent: state.setContent,
    resetModal: state.resetModal,
  }))
  const { isMobile } = useDevice()
  const { handleRemoveStake, isLoading } = useUnstake({
    nominator,
    nominee,
    force: !isNormalUnstake,
  })

  const { setCurrentToast } = useToastStore((state: any) => ({
    setCurrentToast: state.setCurrentToast,
  }))

  useEffect(() => {
    if (isLoading) {
      setCurrentToast({
        severity: ToastSeverity.LOADING,
        title: 'Processing  Unstake',
        description: 'Your unstake transaction is in process.',
      })
    }
  }, [isLoading])

  return (
    <>
      {nominee && (
        <div className="bg-white text-subtleFg flex flex-col p-4 max-w-lg w-full gap-y-3 rounded">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-subtleFg text-lg">Confirm Unstake</span>
            <XMarkIcon
              className="h-3 w-3 cursor-pointer"
              onClick={() => {
                resetModal()
              }}
            />
          </div>
          {isNormalUnstake && (
            <span className="break-words bodyFg text-sm leading-5 max-w-md">
              Please confirm your decision to unstake. Here&apos;s the breakdown of the total amount:
            </span>
          )}
          {!isNormalUnstake && (
            <span className="break-words bodyFg text-sm leading-5 max-w-md">
              Please confirm your decision to force remove stake. Here&apos;s the breakdown of the total amount:
            </span>
          )}
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
          {!isNormalUnstake && (
            <>
              <div className="flex text-dangerFg gap-x-3">
                <div className="flex flex-col justify-start mt-1">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                </div>
                <span className="break-words text-sm leading-5 max-w-md basis-0 grow">
                  It is not recommended to force remove stake while validating. You might lose{' '}
                  <span className="font-semibold">{currentRewards.toFixed(2)} SHM</span> earned in the current cycle.
                </span>
              </div>
              <hr className="my-1" />
            </>
          )}
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
                  className={
                    'text-sm px-3 py-2 border border-bodyFg rounded max-w-[12rem] w-full ' +
                    (isNormalUnstake ? 'text-primary' : 'text-dangerFg font-semibold')
                  }
                  onClick={async () => {
                    const wasUnstakeSuccessful = await handleRemoveStake()
                    resetModal()
                    if (wasUnstakeSuccessful) {
                      if (!isNormalUnstake) {
                        setTimeout(() => {
                          setContent(
                            <MobileModalWrapper
                              closeButtonRequired={false}
                              contentOnTop={false}
                              wrapperClassName="fixed bottom-0 flex flex-col items-center justify-start p-3 rounded-t-2xl min-h-2/3 overflow-scroll bg-white w-screen dropdown-300 text-black"
                            >
                              <ForceUnstakeSuccessModal stake={currentStake} rewards={currentRewards} />
                            </MobileModalWrapper>
                          )
                          setShowModal(true)
                        }, 1000)
                      } else if (isMobile) {
                        setTimeout(() => {
                          setContent(
                            <MobileModalWrapper closeButtonRequired={false} contentOnTop={false}>
                              <UnstakeSuccessModal stake={currentStake} rewards={currentRewards} />
                            </MobileModalWrapper>
                          )
                          setShowModal(true)
                        }, 1000)
                      }
                    }
                  }}
                >
                  {isNormalUnstake ? 'Confirm Unstake' : 'Force Remove Stake'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {!nominee && (
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
