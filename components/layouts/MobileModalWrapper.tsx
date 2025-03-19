import { ReactNode } from 'react'
import { useDevice } from '../../context/device'
import useModalStore from '../../hooks/useModalStore'
import { XMarkIcon } from '@heroicons/react/24/outline'

type MobileModalWrapperProps = {
  children: ReactNode
  closeButtonRequired: boolean
  contentOnTop: boolean
  wrapperClassName?: string
}

export const MobileModalWrapper = ({
  children,
  closeButtonRequired,
  contentOnTop,
  wrapperClassName = '',
}: MobileModalWrapperProps) => {
  const { isMobile } = useDevice()
  const { resetModal } = useModalStore((state: any) => ({
    resetModal: state.resetModal,
  }))

  if (!isMobile) {
    return <>{children}</>
  }

  return (
    <>
      {!closeButtonRequired && !contentOnTop && (
        <div className="flex flex-col items-center justify-start">
          <div
            className={
              wrapperClassName ||
              'fixed bottom-0 flex flex-col items-center justify-start p-3 rounded-t-2xl min-h-1/3 overflow-scroll bg-white w-screen dropdown-300 text-black'
            }
          >
            {children}
          </div>
        </div>
      )}
      {!closeButtonRequired && contentOnTop && (
        <div className="flex flex-col items-center justify-between h-full">
          <div
            className={
              wrapperClassName ||
              'fixed top-0 flex flex-col py-5 px-7 rounded-b-2xl min-h-4/5 overflow-scroll bg-white w-screen dropdown-300 text-black'
            }
          >
            {children}
          </div>
        </div>
      )}
      {closeButtonRequired && contentOnTop && (
        <div className="flex flex-col items-center justify-between h-full">
          <div
            className={
              wrapperClassName ||
              'fixed top-0 flex flex-col py-5 px-7 rounded-b-2xl min-h-4/5 overflow-scroll bg-white w-screen dropdown-300 text-black'
            }
          >
            {children}
          </div>
          <button
            className="flex items-center px-3 py-1 gap-x-2 bg-gray-800 text-gray-300 rounded-full fixed bottom-4"
            onClick={() => {
              resetModal()
            }}
          >
            <span>Close</span>
            <XMarkIcon className="text-gray-300 h-5 w-5" />
          </button>
        </div>
      )}
      {closeButtonRequired && !contentOnTop && (
        <div className="flex flex-col-reverse items-center justify-between h-full">
          <div className="flex flex-col items-center justify-start">
            <div
              className={
                wrapperClassName ||
                'fixed bottom-0 flex flex-col items-center justify-start p-3 rounded-t-2xl min-h-1/3 overflow-scroll bg-white w-screen dropdown-300 text-black'
              }
            >
              {children}
            </div>
          </div>
          <button
            className="flex items-center px-3 py-1 gap-x-2 bg-gray-800 text-gray-300 rounded-full fixed top-8"
            onClick={() => {
              resetModal()
            }}
          >
            <span>Close</span>
            <XMarkIcon className="text-gray-300 h-5 w-5" />
          </button>
        </div>
      )}
    </>
  )
}
