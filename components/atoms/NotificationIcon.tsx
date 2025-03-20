import { NotificationSeverity, NotificationType } from '../../hooks/useNotificationsStore'
import { NodesIcon } from './NodesIcon'
import { ErrorIcon } from './ErrorIcon'
import { RewardIcon } from './RewardIcon'
import { StepsIcon } from './StepsIcon'

type NotificationIconProps = {
  notificationType: NotificationType
  severity: NotificationSeverity
  iconClassName?: string
  containerClassName?: string
}

export const NotificationIcon = ({
  notificationType,
  severity,
  iconClassName = 'h-3 w-3',
  containerClassName,
}: NotificationIconProps) => {
  const fillColor = `${
    severity === NotificationSeverity.SUCCESS
      ? 'rgb(28, 118, 69)'
      : severity === NotificationSeverity.ATTENTION
      ? 'rgb(178, 161, 0)'
      : 'rgb(199, 0, 0)'
  }`

  return (
    <span
      className={
        (containerClassName + ' ' || 'rounded-full border h-5 w-5 flex justify-center items-center ') +
        `${
          severity === NotificationSeverity.SUCCESS
            ? 'border-successBorder bg-successBg'
            : severity === NotificationSeverity.ATTENTION
            ? 'border-attentionBorder bg-attentionBg'
            : 'border-dangerBorder bg-dangerBg'
        } `
      }
    >
      {notificationType === NotificationType.NODE_STATUS ? (
        <NodesIcon className={iconClassName} fillColor={fillColor} />
      ) : notificationType === NotificationType.ERROR ? (
        <ErrorIcon className={iconClassName} fillColor={fillColor} />
      ) : notificationType === NotificationType.REWARD ? (
        <RewardIcon className={iconClassName} fillColor={fillColor} />
      ) : (
        <StepsIcon className={iconClassName} fillColor={fillColor} />
      )}
    </span>
  )
}
