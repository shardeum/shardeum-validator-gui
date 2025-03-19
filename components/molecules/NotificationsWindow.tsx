import React, { useEffect, useRef } from 'react'
import useNotificationsStore, { NotificationInstance } from '../../hooks/useNotificationsStore'
import { NotificationBox } from '../atoms/NotificationBox'

export const NotificationsWindow = () => {
  const { showWindow, setShowWindow, notifications, resetNotifications } = useNotificationsStore((state: any) => ({
    showWindow: state.showWindow,
    setShowWindow: state.setShowWindow,
    notifications: state.notifications,
    resetNotifications: state.resetNotifications,
  }))

  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Function to close the window if clicked outside of it
    const handleClickOutside = (event: MouseEvent) => {
      if (windowRef.current && !windowRef.current.contains(event.target as Node)) {
        setShowWindow(false)
      }
    }

    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside)

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setShowWindow])

  return (
    <div className="md:absolute md:top-5 md:right-0 z-40">
      {showWindow && (
        <div
          ref={windowRef}
          className="flex flex-col max-md:grow bg-white md:border md:p-3 text-black md:rounded md:shadow min-w-[20rem] max-h-[85vh] md:max-h-[60vh] overflow-scroll max-md:px-2"
        >
          {/* header */}
          <div className="flex justify-between items-center px-1 md:mb-3 mb-7">
            <div className="flex gap-x-2 items-center">
              <span className="text-lg font-semibold md:text-sm">Notifications</span>
              {notifications.length > 0 && (
                <span className="px-2 py-1 bg-accentBg text-xs text-accentFg rounded-md">
                  {notifications.length} new
                </span>
              )}
            </div>
            <span
              className="text-xs font-semibold cursor-pointer text-dangerFg hover:scale-105"
              onClick={() => {
                resetNotifications()
                setTimeout(() => {
                  setShowWindow(false)
                }, 1000)
              }}
            >
              Clear all
            </span>
          </div>
          {/* notifications */}
          <div className="flex flex-col-reverse gap-y-2">
            {notifications.map((notification: NotificationInstance) => {
              return <NotificationBox notification={notification} key={notification.timestamp} />
            })}
          </div>
        </div>
      )}
    </div>
  )
}
