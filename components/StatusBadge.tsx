import { InformationCircleIcon } from '@heroicons/react/20/solid'

export default function StatusBadge({ status }: { status: string }) {
  const statusTip = new Map<string, string>(
    Object.entries({
      active:
        'Your node is part of Active validator group. You will start receiving rewards for being an active validator. The network will swap your node back to Standby at an appropriate time.',
      standby:
        'Your node is connected to the network. It is in a Standby Pool and each cycle it has a chance to be randomly selected to go into Validating state',
      stopped: 'Your node is not running and not participating in the network.',
      syncing: 'This node is syncing with the network and will begin validating transactions soon.',
      'need-stake': 'Your node is running, but it will not join the network until you stake.',
      'waiting-for-network':
        'Node is trying to connect to the Shardeum network. If your node is stuck in this for more than 15 minutes then please contact us so we can debug and solve this.',
      selected: 'Your node has been selected from standby list and will be validating soon',
      ready: 'Your node is getting ready to join active validator list',
    })
  )

  const statusColor = new Map<string, string>(
    Object.entries({
      active: 'text-success',
      standby: 'text-success',
      syncing: 'text-success',
      stopped: 'text-error',
      'need-stake': 'text-warning',
      'waiting-for-network': 'text-warning',
      ready: 'text-success',
      selected: 'text-success',
    })
  )

  const getStatusTitle = (status: string) => {
    switch (status) {
      case 'active':
        return 'Validating'
      case 'standby':
        return 'On Standby'
      case 'stopped':
        return 'Stopped'
      case 'syncing':
        return 'Syncing'
      case 'need-stake':
        return 'No SHM Staked'
      case 'waiting-for-network':
        return 'Waiting for network'
      case 'ready':
        return 'Ready'
      case 'selected':
        return 'Selected'
      default:
        return status
    }
  }

  return (
    <div className="tooltip normal-case" data-tip={statusTip.get(status)}>
      <InformationCircleIcon className={`h-5 w-5 mb-1 inline ${statusColor.get(status)}`} />
      <span className={`ml-1 ${statusColor.get(status)}`}>{getStatusTitle(status)}</span>
    </div>
  )
}
