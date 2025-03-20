import { useState } from 'react'
import { Card } from '../layouts/Card'

type AutoRestartNodeToggleProps = {
  isOn: boolean
  onClick: () => Promise<void>
}

export const AutoRestartNodeToggle = ({ isOn, onClick }: AutoRestartNodeToggleProps) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Card>
      <div className="p-5 flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Auto Restart Node</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isOn}
              onClick={async () => {
                setIsLoading(true)
                await onClick()
                setIsLoading(false)
              }}
              className="sr-only peer"
            />
            {!isLoading && (
              <span className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></span>
            )}
            {isLoading && (
              <span className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:before:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></span>
            )}
          </label>
        </div>
        <span className="break-normal text-sm bodyFg max-w-xl">
          You can set the node to auto-restart by toggling this on. This will enable your node to automatically start
          when stopped
        </span>
      </div>
    </Card>
  )
}
