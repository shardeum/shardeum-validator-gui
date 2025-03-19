import { Card } from '../layouts/Card'
import { useNodeNetwork } from '../../hooks/useNodeNetwork'

export const NetworkSizeCard = () => {
  const { network } = useNodeNetwork()

  return (
    <Card>
      <div className="flex flex-col px-5 py-5">
        <div className="flex justify-between items-center">
          <div className="flex flex-col basis-0 grow">
            <span className="font-semibold max-md:text-lg">{network?.active || 0}</span>
            <span className="text-gray-600 text-xs">Active validators</span>
          </div>
          <div className="h-10 border-l w-1"></div>
          <div className="flex flex-col basis-0 grow ml-10">
            <span className="font-semibold max-md:text-lg">{network?.standby || 0}</span>
            <span className="text-gray-600 text-xs">Standby validators</span>
          </div>
        </div>
        <hr className="mt-4 mb-3" />
        <div className="flex justify-between">
          <span className="text-xs text-gray-600">Desired network size</span>
          <span className="font-semibold text-xs">{network?.desired}</span>
        </div>
        <hr className="mt-3 mb-2" />
        <div className="flex justify-between">
          <span className="text-xs ">Validators joining</span>
          <span className="font-semibold text-xs">{network?.joining || 0}</span>
        </div>
        <hr className="mt-3 mb-2" />
        <div className="flex justify-between">
          <span className="text-xs ">Validators syncing</span>
          <span className="font-semibold text-xs">{network?.syncing || 0}</span>
        </div>
      </div>
    </Card>
  )
}
