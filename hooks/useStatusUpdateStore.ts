import { create } from 'zustand'

const useStatusUpdateStore = create((set: any) => ({
  currentStatus: null,
  exitStatus: null,
  exitMessage: null,
  setCurrentStatus: (currentStatus: string, exitStatus?: string, exitMessage?: string) =>
    set((state: any) => {
      return { ...state, currentStatus, exitStatus, exitMessage }
    }),
  reset: () =>
    set((state: any) => {
      return { ...state, currentStatus: null, exitStatus: null, exitMessage: null }
    }),
}))

export default useStatusUpdateStore
