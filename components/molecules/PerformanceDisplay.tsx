import { CpuChipIcon } from '@heroicons/react/24/solid'
import { Card } from '../layouts/Card'
import { UsageBar } from '../atoms/UsageBar'
import ramIcon from '../../assets/ram-icon.svg'
import diskIcon from '../../assets/disk-icon.svg'
import networkIcon from '../../assets/network-icon.svg'
import { useNodeStatus } from '../../hooks/useNodeStatus'
import { useNodePerformance } from '../../hooks/useNodePerformance'
import { useNodeNetwork } from '../../hooks/useNodeNetwork'
import { BgImage } from '../atoms/BgImage'

export const PerformanceDisplay = () => {
  const { performance } = useNodePerformance()
  const { nodeStatus } = useNodeStatus()
  const { network } = useNodeNetwork()

  const cpuUsage = nodeStatus?.performance?.cpuPercentage || 0
  const ramUsage = nodeStatus?.performance?.memPercentage || 0
  const diskUsage = nodeStatus?.performance?.diskPercentage || 0
  const networkUsage = performance?.[0]?.network || 0

  return (
    <div className="flex flex-col gap-y-5">
      {/* Usage %  */}
      <Card>
        <div className="flex max-md:flex-col p-4 md:p-8">
          <div className="flex grow flex-col">
            {/* CPU */}
            <div className="flex flex-col grow max-md:gap-y-2 border-b md:border-r md:border-b p-3 py-5 md:p-5">
              <div className="flex items-center">
                <CpuChipIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600 ml-3">CPU</span>
              </div>
              <span className="font-semibold text-xl md:text-lg">{cpuUsage.toFixed(2)}%</span>
              <UsageBar usage={cpuUsage} />
            </div>
            <div className="h-full border w-0"></div>

            {/* DISK */}
            <div className="flex flex-col grow max-md:gap-y-2 max-md:border-b md:border-r p-3 py-5 md:p-5">
              <div className="flex items-center">
                <span className="h-5 w-5 text-gray-400">
                  <BgImage src={diskIcon} alt="disk-icon" />
                </span>
                <span className="text-gray-600 ml-3">Disk</span>
              </div>
              <span className="font-semibold text-xl md:text-lg">{diskUsage.toFixed(2)}%</span>
              <UsageBar usage={diskUsage} />
            </div>
          </div>

          <div className="flex grow flex-col">
            {/* RAM */}
            <div className="flex flex-col grow max-md:gap-y-2 border-b md:border-b p-3 py-5 md:p-5">
              <div className="flex items-center">
                <span className="h-5 w-5 text-gray-400">
                  <BgImage src={ramIcon} alt="ram-icon" />
                </span>
                <span className="text-gray-600 ml-3">RAM</span>
              </div>
              <span className="font-semibold text-xl md:text-lg">{ramUsage.toFixed(2)}%</span>
              <UsageBar usage={ramUsage} />
            </div>

            {/* NETWORK */}
            <div className="flex flex-col grow max-md:gap-y-2 p-3 py-5 md:p-5">
              <div className="flex items-center">
                <span className="h-5 w-5 text-gray-400">
                  <BgImage src={networkIcon} alt="network-icon" />
                </span>
                <span className="text-gray-600 ml-3">Network</span>
              </div>
              <span className="font-semibold text-xl md:text-lg">{networkUsage.toFixed(2)}%</span>
              <UsageBar usage={networkUsage} />
            </div>
          </div>
        </div>
      </Card>

      {/* TPS Overview  */}
      <Card>
        <div className="flex flex-col p-4 md:p-8">
          <span className="font-semibold">TPS Overview</span>
          <hr className="mt-5 mb-2" />
          <div className="flex justify-between items-center">
            <span className="text-sm">Node Throughput</span>
            <span className="font-semibold text-sm">
              {Number.isFinite(network?.txApplied) ? network?.txApplied : 'N/A'}
            </span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between items-center">
            <span className="text-sm">Transaction Processed</span>
            <span className="font-semibold text-sm">
              {Number.isFinite(network?.txProcessed) ? network?.txProcessed : 'N/A'}
            </span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between items-center">
            <span className="text-sm">State Storage Usage</span>
            <span className="font-semibold text-sm">{nodeStatus?.performance?.stateStorage || 'N/A'}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
