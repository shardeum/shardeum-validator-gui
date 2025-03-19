import { NodeStatus } from '../model/node-status'
import { ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/20/solid'
import React from 'react'

export default function NodeExitStatus({ nodeStatus }: { nodeStatus: NodeStatus }) {
  return (
    <>
      {nodeStatus.exitStatus != null && (
        <>
          <div className="flex items-center">
            <div>
              {nodeStatus.exitStatus === 'Exited cleanly' && (
                <InformationCircleIcon className="h-7 w-7 text-blue-600" />
              )}
              {nodeStatus.exitStatus === 'Exit with warning' && (
                <ExclamationTriangleIcon className="h-7 w-7 text-yellow-500" />
              )}
              {nodeStatus.exitStatus === 'Exit with error' && (
                <ExclamationCircleIcon className="h-7 w-7 text-red-500" />
              )}
            </div>
            <div className="ml-2 overflow-auto p-2 border border-gray-300 rounded bg-white my-4 text-sm text-gray-500">
              Node exited with the following message: <pre>{nodeStatus.exitMessage}</pre>
            </div>
          </div>
        </>
      )}
    </>
  )
}
