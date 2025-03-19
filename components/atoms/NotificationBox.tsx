import { XMarkIcon } from '@heroicons/react/24/outline'
import useNotificationsStore, { NotificationInstance } from '../../hooks/useNotificationsStore'
import { NotificationIcon } from './NotificationIcon'

type NotificationBoxProps = {
  notification: NotificationInstance
  deleteNotificationOnClosing?: boolean
  onClose?: () => void
}

export const timeSince = (timestamp: number) => {
  const seconds = Math.floor((new Date().getTime() - timestamp) / 1000)

  let interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + ' years'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + ' months'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + ' days'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' hours'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' minutes'
  }
  return Math.floor(seconds) + ' seconds'
}

export const NotificationBox = ({
  notification,
  deleteNotificationOnClosing = true,
  onClose,
}: NotificationBoxProps) => {
  const { removeNotification } = useNotificationsStore((state: any) => ({
    removeNotification: state.removeNotification,
  }))

  return (
    <div className="border rounded flex max-md:px-3 max-md:py-5 py-2 px-3 dropdown-300">
      <div className="flex justify-between w-full max-md:gap-x-4">
        <div className="flex gap-x-4 md:gap-x-2">
          <div className="flex flex-col justify-start">
            <NotificationIcon
              notificationType={notification.type}
              severity={notification.severity}
              iconClassName="h-3 w-3 max-md:h-7 max-md:w-7"
              containerClassName="rounded-full border h-5 w-5 flex justify-center items-center
              max-md:h-8 max-md:w-8"
            />
          </div>
          <div className="flex flex-col justify-start max-md:gap-y-2">
            <span className="text-sm max-md:max-w-[16rem] md:text-xs text-subtleFg md:font-semibold">
              {notification.title}
            </span>
            <span className="bodyFg text-xs">{timeSince(notification.timestamp)} ago</span>
          </div>
        </div>
        <div className="flex justify-end items-start">
          <XMarkIcon
            className="h-3 w-3 cursor-pointer"
            onClick={() => {
              if (deleteNotificationOnClosing) {
                removeNotification(notification)
              }
              if (onClose) {
                onClose()
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
