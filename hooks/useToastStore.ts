import { create } from 'zustand'
import {
  NotificationInstance,
  NotificationSeverity,
  NotificationType,
  useNotificationsStore,
} from './useNotificationsStore'

export enum ToastSeverity {
  DANGER = 'DANGER',
  ATTENTION = 'ATTENTION',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
}

export type ToastInstance = {
  severity: ToastSeverity
  title: string
  description?: string
  duration?: number
  followupNotification?: Omit<NotificationInstance, 'timestamp'>
  upgradeTimeout?: ReturnType<typeof setTimeout>
}

export const DEFAULT_TOAST_DURATION = 7000 // in ms

export const showErrorMessage = (msg: string) => {
  useToastStore.getState().resetToast()
  useToastStore.getState().setCurrentToast({
    severity: ToastSeverity.DANGER,
    title: msg,
    followupNotification: {
      type: NotificationType.ERROR,
      severity: NotificationSeverity.DANGER,
      title: msg,
    },
  })
}

export const showSuccessMessage = (msg: string) => {
  useToastStore.getState().resetToast()
  useToastStore.getState().setCurrentToast({
    severity: ToastSeverity.SUCCESS,
    title: msg,
    followupNotification: {
      type: NotificationType.NODE_STATUS,
      severity: NotificationSeverity.SUCCESS,
      title: msg,
    },
  })
}

const useToastStore = create((set: any) => ({
  currentToast: null,
  setCurrentToast: (currentToast: ToastInstance) =>
    set((state: any) => {
      // if (state.currentToast?.upgradeTimeout) {
      //   clearTimeout(state.currentToast?.upgradeTimeout);
      // }
      const newTimeout = setTimeout(() => {
        if (currentToast.followupNotification) {
          useNotificationsStore.getState().addNotification(currentToast?.followupNotification)
        }
        state.resetToast()
      }, currentToast.duration || DEFAULT_TOAST_DURATION)
      currentToast.upgradeTimeout = newTimeout
      return { ...state, currentToast }
    }),
  cancelToastUpgrade: () =>
    set((state: any) => {
      if (state.currentToast?.upgradeTimeout) {
        clearTimeout(state.currentToast?.upgradeTimeout)
      }
      return { ...state, currentToast: null }
    }),
  resetToast: () =>
    set((state: any) => {
      return { ...state, currentToast: null }
    }),
}))

export default useToastStore
