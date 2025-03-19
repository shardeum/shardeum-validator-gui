import { NodesIcon } from './NodesIcon'
import { ErrorIcon } from './ErrorIcon'
import { ToastSeverity } from '../../hooks/useToastStore'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

type ToastIconProps = {
  severity: ToastSeverity
}

export const ToastIcon = ({ severity }: ToastIconProps) => {
  const iconClassName = 'h-5 w-5'
  const fillColor = `${
    severity === ToastSeverity.SUCCESS
      ? 'rgb(28, 118, 69)'
      : severity === ToastSeverity.ATTENTION
      ? 'rgb(178, 161, 0)'
      : 'rgb(199, 0, 0)'
  }`

  return (
    <>
      {severity === ToastSeverity.SUCCESS ? (
        <CheckCircleIcon className={iconClassName + ' text-green-700'} />
      ) : severity === ToastSeverity.ATTENTION ? (
        <NodesIcon className={iconClassName} fillColor={fillColor} />
      ) : severity === ToastSeverity.LOADING ? (
        <div className="spinner flex items-center justify-center mt-1">
          <div className="border-2 border-black border-b-white rounded-full h-3.5 w-3.5"></div>
        </div>
      ) : (
        <ErrorIcon
          className={iconClassName + ' bg-dangerBg rounded-full h-5 w-5 p-0.5 border border-dangerBorder'}
          fillColor={fillColor}
        />
      )}
    </>
  )
}
