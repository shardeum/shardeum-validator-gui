import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import useModalStore from '../../hooks/useModalStore'
import { useNodeStatus } from '../../hooks/useNodeStatus'

export const ConfirmForceStopModal = () => {
  const { stopNode, isLoading } = useNodeStatus()

  const { resetModal } = useModalStore((state: any) => ({
    resetModal: state.resetModal,
  }))

  return (
    <div className="bg-white text-subtleFg flex flex-col p-4 max-w-lg w-full gap-y-3 rounded">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-subtleFg text-lg">Confirm Force Stop Node</span>
        <XMarkIcon
          className="h-3 w-3 cursor-pointer"
          onClick={() => {
            resetModal()
          }}
        />
      </div>
      <span className="break-words bodyFg text-sm leading-5 max-w-md">
        Please confirm your decision to force stop node.
      </span>

      <hr className="my-1" />
      <div className="flex text-dangerFg gap-x-3">
        <div className="flex flex-col justify-start mt-1">
          <ExclamationTriangleIcon className="h-5 w-5" />
        </div>
        <span className="break-words text-sm leading-5 max-w-md basis-0 grow">
          It is not recommended to force stop node while validating as you may lose rewards earned in the current cycle.
        </span>
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
            Stopping node
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
              Don&apos;t Stop
            </button>
            <button
              className="text-sm px-3 py-2 border border-bodyFg rounded max-w-[12rem] w-full text-dangerFg font-semibold"
              onClick={async () => {
                await stopNode()
                resetModal()
              }}
            >
              Force Stop Node
            </button>
          </>
        )}
      </div>
    </div>
  )
}
