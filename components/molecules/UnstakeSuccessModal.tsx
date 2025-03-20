import useModalStore from '../../hooks/useModalStore'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/20/solid'

type UnstakeSuccessModalProps = {
  stake: number
  rewards: number
}

export const UnstakeSuccessModal = ({ stake, rewards }: UnstakeSuccessModalProps) => {
  const { resetModal } = useModalStore((state: any) => ({
    resetModal: state.resetModal,
  }))

  return (
    <div className="bg-white text-subtleFg flex flex-col p-4 max-w-sm w-full rounded">
      <div className="flex flex-col items-center gap-y-3">
        <div className="flex w-full justify-end">
          <XMarkIcon
            className="h-3 w-3 cursor-pointer"
            onClick={() => {
              resetModal()
            }}
          />
        </div>
        <div className="w-full flex justify-center items-center">
          <CheckCircleIcon className="h-10 w-10 text-green-700 bg-white" />
        </div>

        <span className="text-lg font-semibold">Unstake Successful</span>

        <span className="text-sm bodyFg text-center">
          You&apos;ve successfully unstaked <span className="font-semibold">{(stake + rewards).toFixed(2)}</span> SHM
          into your wallet.
        </span>
        <hr className="mt-1 w-full" />
        <button className="w-full bg-primary text-white px-4 py-2 mt-2 rounded" onClick={resetModal}>
          Continue
        </button>
      </div>
    </div>
  )
}
