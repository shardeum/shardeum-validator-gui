import { ReactNode } from 'react'
import { create } from 'zustand'

const useModalStore = create((set) => ({
  content: null,
  showModal: false,
  setShowModal: (showModal: boolean) =>
    set((state: any) => {
      const modal = document.getElementById('genericModal') as HTMLDialogElement
      modal?.close()
      if (showModal) {
        modal?.showModal()
      }
      return { ...state, showModal }
    }),
  setContent: (content: ReactNode) =>
    set((state: any) => {
      return { ...state, content }
    }),
  resetModal: () =>
    set((state: any) => {
      const modal = document.getElementById('genericModal') as HTMLDialogElement
      modal?.close()
      return { ...state, showModal: false, content: null }
    }),
}))

export default useModalStore
