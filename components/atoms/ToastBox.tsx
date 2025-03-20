import { XMarkIcon } from '@heroicons/react/24/outline'
import { DEFAULT_TOAST_DURATION, ToastInstance, ToastSeverity } from '../../hooks/useToastStore'
import { ToastIcon } from './ToastIcon'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type ToastBoxProps = {
  toast: ToastInstance
  onClose?: () => void
  viewLogsOnClick: () => void
  disableActions?: boolean
}

const INTERVAL_DURATION = 10 // in ms

export const ToastBox = ({ toast, onClose, viewLogsOnClick, disableActions = false }: ToastBoxProps) => {
  const [widthPercentage, setWidthPercentage] = useState(100.0)
  const totalDuration = toast?.duration || DEFAULT_TOAST_DURATION

  useEffect(() => {
    if (toast.severity !== ToastSeverity.LOADING) {
      const startTime = Date.now()
      const widthSetterInterval = setInterval(() => {
        const decreasePercentage = ((Date.now() - startTime) / totalDuration) * 100.0
        setWidthPercentage(100.0 - decreasePercentage)
      }, INTERVAL_DURATION)

      setTimeout(() => {
        clearInterval(widthSetterInterval)
      }, toast?.duration || DEFAULT_TOAST_DURATION)
    }
  }, [])

  return (
    <div className="border rounded shadow">
      <div className="flex p-4 dropdown-300 bg-white text-black min-w-[20rem]">
        <div className="flex justify-between w-full">
          <div className="flex gap-x-2">
            <div className="flex flex-col justify-start">
              <ToastIcon severity={toast.severity} />
            </div>
            <div className="flex flex-col justify-start gap-y-1">
              <span className={'font-semibold ' + (toast.severity === ToastSeverity.DANGER ? 'text-xs' : 'text-sm')}>
                {toast.title}
              </span>
              {toast.description && <span className="text-xs bodyFg font-light">{toast.description}</span>}
              {!disableActions && toast.severity === ToastSeverity.DANGER && (
                <div className="flex text-xs gap-x-3">
                  <button className="text-primary" onClick={viewLogsOnClick}>
                    View Logs
                  </button>
                  <Link href="mailto:support@shardeum.org" target="_blank">
                    <button className="text-primary">Get Help</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end items-start">
            <XMarkIcon
              className="h-4 w-4 cursor-pointer"
              onClick={() => {
                if (onClose) {
                  onClose()
                }
              }}
            />
          </div>
        </div>
      </div>
      <div
        className={`h-0.5 rounded ${
          toast.severity === ToastSeverity.SUCCESS
            ? 'bg-successFg'
            : toast.severity === ToastSeverity.ATTENTION
            ? 'bg-attentionFg'
            : toast.severity === ToastSeverity.LOADING
            ? 'bg-primary'
            : 'bg-dangerFg'
        }`}
        style={{
          width: `${widthPercentage}%`,
        }}
      ></div>
    </div>
  )
}
