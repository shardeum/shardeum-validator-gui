import { create } from 'zustand'

const useStatusUpdateStore = create((set: any) => ({
  currentStatus: null,
  setCurrentStatus: (currentStatus: string) =>
    set((state: any) => {
      return { ...state, currentStatus }
    }),
  reset: () =>
    set((state: any) => {
      return { ...state, currentStatus: null }
    }),
}))

export default useStatusUpdateStore
