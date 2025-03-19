import { create } from 'zustand'

const MAX_NOTIFICATIONS_STORED = 50
export enum NotificationType {
  NODE_STATUS = 'NODE_STATUS',
  ERROR = 'ERROR',
  REWARD = 'REWARD',
  VERSION_UPDATE = 'VERSION_UPDATE',
  UNSTAKE_STATUS = 'UNSTAKE_STATUS',
}

export enum NotificationSeverity {
  DANGER = 'DANGER',
  ATTENTION = 'ATTENTION',
  SUCCESS = 'SUCCESS',
}

export type NotificationInstance = {
  type: NotificationType
  severity: NotificationSeverity
  title: string
  timestamp: number
}

const notificationsKey = 'pendingNotifications'

const persistNotifications = (notifications: NotificationInstance[]) => {
  try {
    window.localStorage.setItem(notificationsKey, JSON.stringify(notifications))
  } catch (error) {
    console.log(error)
  }
}

const fetchPreviousNotifications = () => {
  try {
    const notificationsItem = window.localStorage.getItem(notificationsKey)
    return notificationsItem ? JSON.parse(notificationsItem) : []
  } catch (error) {
    console.log(error)
  }
}

const pendingNotifications = fetchPreviousNotifications()

export const useNotificationsStore = create((set: any) => ({
  showWindow: false,
  notifications: pendingNotifications || [],
  latestNotification: null,
  setShowWindow: (showWindow: boolean) =>
    set((state: any) => {
      return { ...state, showWindow }
    }),
  addNotification: ({
    type,
    severity,
    title,
  }: {
    type: Omit<NotificationType, 'timestamp'>
    severity: NotificationSeverity
    title: string
  }) =>
    set((state: any) => {
      if (type === NotificationType.VERSION_UPDATE) {
        if (
          (state.notifications || []).find(
            (notification: NotificationInstance) => notification.title === title && notification.type === type
          )
        ) {
          return state
        }
      }
      const notification = { type, severity, title, timestamp: new Date().getTime() } as NotificationInstance
      const newNotifications = [...state.notifications, notification].slice(-MAX_NOTIFICATIONS_STORED)
      persistNotifications(newNotifications)
      return { ...state, notifications: newNotifications }
    }),
  removeNotification: (notification: NotificationInstance) =>
    set((state: any) => {
      let newNotifications = state.notifications
      for (let i = 0; i < newNotifications.length; i++) {
        const existingNotification = newNotifications[i]
        if (
          existingNotification.type === notification.type &&
          existingNotification.severity === notification.severity &&
          existingNotification.title === notification.title &&
          existingNotification.timestamp === notification.timestamp
        ) {
          newNotifications.splice(i, 1)
          break
        }
      }
      persistNotifications(newNotifications)
      return { ...state, notifications: newNotifications }
    }),
  resetNotifications: () =>
    set((state: any) => {
      persistNotifications([])
      return { ...state, notifications: [] }
    }),
}))

export default useNotificationsStore
