import { useEffect, useState } from 'react'
import { useNodeVersion } from '../../hooks/useNodeVersion'
import Link from 'next/link'
import { onboardingCompletedKey } from '../../pages/onboarding'
import { XMarkIcon } from '@heroicons/react/24/outline'
import greyLogo from '../../assets/grey-logo.svg'
import useNotificationsStore, { NotificationSeverity, NotificationType } from '../../hooks/useNotificationsStore'

const newGuiVersionAvailableKey = 'newGuiVersionAvailable'

const VERSION_UPDATE_REPOSITORY_URL =
  process.env.VERSION_UPDATE_REPOSITORY_URL ?? 'https://docs.shardeum.org/docs/node/run/validator/setup/self-host#update'

export const InformationPopupsDisplay = () => {
  const { addNotification } = useNotificationsStore((state: any) => ({
    addNotification: state.addNotification,
  }))
  const { version } = useNodeVersion()

  useEffect(() => {
    const newGuiAvailable = version?.currentImageDigest &&
      version?.latestImageDigest &&
      version?.currentImageDigest !== version?.latestImageDigest

    if (newGuiAvailable) {
      addNotification({
        type: NotificationType.VERSION_UPDATE,
        severity: NotificationSeverity.ATTENTION,
        title: 'New GUI version available',
      })

      const wasNewGuiVersionPreviouslyAvailable = localStorage.getItem(newGuiVersionAvailableKey) === 'true'
      if (!wasNewGuiVersionPreviouslyAvailable) {
        // user viewing this for the first time
        setShowGuiUpdatePrompt(true)
        localStorage.setItem(newGuiVersionAvailableKey, 'true')
        //TODO: if it's not in pending notifications, add it to pending notifications
      }
    } else {
      const wasNewGuiVersionPreviouslyAvailable = localStorage.getItem(newGuiVersionAvailableKey) === 'true'
      if (wasNewGuiVersionPreviouslyAvailable) {
        localStorage.removeItem(newGuiVersionAvailableKey)
        setShowGuiUpdated(true)
        setShowGuiUpdatePrompt(false)
        addNotification({
          type: NotificationType.VERSION_UPDATE,
          severity: NotificationSeverity.SUCCESS,
          title: `Your GUI version has been updated to Version: ${version?.runningCliVersion}`,
        })
      }
    }
  }, [version])

  const [showGuiUpdatePrompt, setShowGuiUpdatePrompt] = useState(false)
  const [showGuiUpdated, setShowGuiUpdated] = useState(false)

  const isOnboardingCompleted = localStorage.getItem(onboardingCompletedKey) === 'true'

  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(!isOnboardingCompleted)

  return (
    <div className="flex flex-col gap-y-3">
      {showOnboardingPrompt && (
        <div className="w-full h-full border shadow rounded p-4 bg-white max-md:hidden">
          <div className="flex">
            <div className="flex flex-col grow gap-x-3">
              <span className="text-sm font-semibold">Finish setting up your node</span>
              <div className="flex justify-start mt-3">
                <span className="bodyFg text-xs font-light">Start your node, add stake and begin validating.</span>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center max-w-[5rem] w-full mr-6">
              <div
                className="fill-bg h-full w-full"
                style={{
                  backgroundImage: `url(${greyLogo.src})`,
                }}
              ></div>
            </div>
            <div className="flex flex-col justify-start">
              <XMarkIcon
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  localStorage.setItem(onboardingCompletedKey, 'true')
                  setShowOnboardingPrompt(false)
                }}
              />
            </div>
          </div>
        </div>
      )}
      {!showOnboardingPrompt && <span className="text-4xl font-semibold">Welcome Validator!</span>}
      {showGuiUpdatePrompt && version?.latestImageDigest && (
        <div className="w-full h-full shadow border border-attentionBorder bg-attentionBg rounded p-4">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span className="font-semibold text-xs">New GUI version available</span>
              <span className="bodyFg font-light text-xs">
                A new GUI version (Image Digest: {version?.latestImageDigest}) is available and ready to update.
              </span>
            </div>
            <div className="flex justify-end gap-x-3 w-full mt-2">
              <button
                className="text-xs px-3 py-2"
                onClick={() => {
                  setShowGuiUpdatePrompt(false)
                }}
              >
                Dismiss
              </button>
              <Link
                href={VERSION_UPDATE_REPOSITORY_URL}
                onClick={() => {
                  setShowGuiUpdatePrompt(false)
                }}
                target="_blank"
                className="flex justify-center items-center bg-white border border-gray-300 rounded text-xs font-semibold w-24 py-1"
              >
                Update
              </Link>
            </div>
          </div>
        </div>
      )}
      {showGuiUpdated && (
        <div className="w-full h-full shadow border border-successBorder bg-successBg rounded p-4">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span className="font-semibold text-xs">GUI version has been updated</span>
              <span className="bodyFg font-light text-xs">
                Your validator has been updated to Version {version?.runningCliVersion} and is ready to be used.
              </span>
            </div>
            <div className="flex justify-end gap-x-3 w-full">
              <button
                className="text-xs px-3 py-2"
                onClick={() => {
                  setShowGuiUpdated(false)
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
