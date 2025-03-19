import { useEffect, useRef } from 'react'
import useModalStore from '../../hooks/useModalStore'

export const Modal = () => {
  const { showModal, resetModal, content } = useModalStore((state: any) => ({
    showModal: state.showModal,
    resetModal: state.resetModal,
    content: state.content,
  }))

  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (dialogRef.current) {
      if (showModal) {
        dialogRef.current.showModal()
      } else {
        dialogRef.current.close()
      }
    }
  }, [showModal])

  return (
    <>
      {showModal && (
        <dialog
          id="genericModal"
          className="flex h-screen w-screen max-md:items-end items-start justify-center bg-transparent relative"
          ref={dialogRef}
          onCancel={resetModal}
          onClick={() => {
            resetModal()
          }}
        >
          <div
            id="modal-container"
            className="flex w-full justify-center items-center bg-transparent"
            onClick={(e) => {
              if ((e.target as HTMLDivElement).id !== 'modal-container') {
                e.stopPropagation()
              }
            }}
          >
            {content}
          </div>
        </dialog>
      )}
    </>
  )
}
