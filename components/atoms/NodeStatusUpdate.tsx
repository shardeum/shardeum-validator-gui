import { XMarkIcon } from '@heroicons/react/24/outline'
import useStatusUpdateStore from '../../hooks/useStatusUpdateStore'

const getStatusUpdateText = (status: string, exitStatus?: string | null, exitMessage?: string | null) => {
  let statusUpdateText = ''
  switch (status) {
    case 'active':
      statusUpdateText = 'Hey there! While you were away, you were moved into the validating queue.'
      break
    case 'stopped':
      if (exitStatus != null && exitStatus !== '' && exitStatus !== 'Exited cleanly') {
        statusUpdateText =
          'Your node stopped unexpectedly while you were away. Please start the node to start earning rewards.'
      } else {
        statusUpdateText = 'Your node is stopped. Please start the node to start earning rewards.'
      }
      break
    case 'need-stake':
      statusUpdateText =
        'Your node is on standby as you do not have any staked SHM. Please stake a minimum of 10 SHM to start validating.'
      break
    case 'waiting-for-network':
      statusUpdateText =
        'Your node is trying to connect to the Shardeum network. If this status persists please reach out to us.'
      break
    case 'ready':
      statusUpdateText = 'Your node is ready to join the network. It will be selected for validation soon.'
      break
    case 'selected':
      statusUpdateText = 'Your node has been selected for validation and will start validating shortly.'
      break
    case 'standby':
      statusUpdateText = 'Your node is currently on standby. It will be activated when needed by the network.'
      break
    case 'syncing':
      statusUpdateText = 'Your node is currently syncing with the network. This process may take some time.'
      break
    default:
      break
  }
  return statusUpdateText
}

const getBgColor = (state: string) => {
  switch (state) {
    case 'active':
    case 'selected':
    case 'ready':
      return 'successBg'
    case 'stopped':
      return 'dangerBg'
    case 'waiting-for-network':
    case 'syncing':
    case 'standby':
      return 'attentionBg'
    case 'need-stake':
      return 'severeBg'
    default:
      return 'subtleBg'
  }
}

const getBorderColor = (state: string) => {
  switch (state) {
    case 'active':
    case 'ready':
    case 'selected':
      return 'successBorder'
    case 'stopped':
      return 'dangerBorder'
    case 'waiting-for-network':
    case 'standby':
    case 'syncing':
      return 'attentionBorder'
    case 'need-stake':
      return 'severeBorder'
    default:
      return 'subtleBorder'
  }
}

export const NodeStatusUpdate = () => {
  const { currentStatus, exitStatus, exitMessage, reset } = useStatusUpdateStore((state: any) => ({
    currentStatus: state.currentStatus,
    exitStatus: state.exitStatus,
    exitMessage: state.exitMessage,
    reset: state.reset,
  }))

  return (
    <div>
      {/* This hidden div ensures that Tailwind CSS classes are included in the final build */}
      <div className="hidden">
        <span className="bg-successBg text-xl border-successBorder text-successFg">1</span>
        <span className="bg-severeBg text-xl border-severeBorder text-severeFg">2</span>
        <span className="bg-attentionBg text-xl border-attentionBorder text-attentionFg">3</span>
        <span className="bg-subtleBg text-xl border-subtleBorder text-subtleFg">4</span>
        <span className="bg-dangerBg text-xl border-dangerBorder text-dangerFg">5</span>
        <span className="bg-infoBg text-xl border-infoBorder text-infoFg">6</span>
        <span className="bg-selectedBg text-xl border-selectedBorder text-selectedFg">7</span>
        <span className="bg-readyBg text-xl border-readyBorder text-readyFg">8</span>
      </div>
      {currentStatus && (
        <div
          className={`absolute top-0 left-10 flex gap-x-2 items-center px-4 py-2 rounded bg-${getBgColor(
            currentStatus
          )} border border-${getBorderColor(currentStatus)} border-t-0`}
        >
          <span className="bodyFg font-light text-xs ">{getStatusUpdateText(currentStatus, exitStatus, exitMessage)}</span>
          <div>
            <XMarkIcon className="h-3 w-3 cursor-pointer" onClick={reset} />
          </div>
        </div>
      )}
    </div>
  )
}
