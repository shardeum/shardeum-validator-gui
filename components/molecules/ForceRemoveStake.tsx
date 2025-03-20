import useModalStore from '../../hooks/useModalStore'
import { Card } from '../layouts/Card'
import { MobileModalWrapper } from '../layouts/MobileModalWrapper'
import { ConfirmUnstakeModal } from './ConfirmUnstakeModal'

type ForceRemoveStakeProps = {
  nominator: string
  nominee: string
  isEnabled: boolean
  currentRewards: number
  currentStake: number
}

export const ForceRemoveStake = ({
  nominator,
  nominee,
  currentRewards,
  currentStake,
  isEnabled,
}: ForceRemoveStakeProps) => {
  const { setShowModal, setContent, resetModal } = useModalStore((state: any) => ({
    setShowModal: state.setShowModal,
    setContent: state.setContent,
    resetModal: state.resetModal,
  }))

  return (
    <div className="flex flex-col">
      <Card>
        <div className="p-5 flex flex-col gap-y-4">
          <div className="flex max-md:flex-col justify-between">
            <div className="flex flex-col gap-y-2 w-full">
              <span className="font-semibold">Force Remove Stake</span>
              <span className="bodyFg text-sm">This action will try to forcefully remove your stake.</span>
            </div>
            <div className="flex w-full justify-end max-md:mt-3">
              <button
                className={
                  'h-10 border-gray-400 border text-sm px-3 rounded font-semibold ' +
                  (isEnabled ? 'text-dangerFg' : 'text-gray-400')
                }
                disabled={!isEnabled}
                onClick={() => {
                  resetModal()
                  setContent(
                    <MobileModalWrapper
                      closeButtonRequired={false}
                      contentOnTop={false}
                      wrapperClassName="fixed bottom-0 flex flex-col items-center justify-start p-3 rounded-t-2xl min-h-2/3 overflow-scroll bg-white w-screen dropdown-300 text-black"
                    >
                      <ConfirmUnstakeModal
                        nominator={nominator}
                        nominee={nominee}
                        isNormalUnstake={false}
                        currentRewards={currentRewards}
                        currentStake={currentStake}
                      ></ConfirmUnstakeModal>
                    </MobileModalWrapper>
                  )
                  setShowModal(true)
                }}
              >
                Force Remove Stake
              </button>
            </div>
          </div>
        </div>
      </Card>
      <div className="flex mt-1 ml-1">
        <span className="text-xs font-semibold text-dangerFg">Warning: &nbsp;</span>
        <span className="text-xs font-light bodyBg">
          This action is not recommended and only to be used in case of absolute emergency.
        </span>
      </div>
    </div>
  )
}
