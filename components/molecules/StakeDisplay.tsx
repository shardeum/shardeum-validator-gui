import { Card } from '../layouts/Card'
import { useEffect, useRef, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { useNodeStatus } from '../../hooks/useNodeStatus'
import useModalStore from '../../hooks/useModalStore'
import { AddStakeModal } from './AddStakeModal'
import { CHAIN_ID } from '../../pages/_app'
import { WalletConnectButton } from './WalletConnectButton'
import { ConfirmUnstakeModal } from './ConfirmUnstakeModal'
import { ClipboardIcon } from '../atoms/ClipboardIcon'
import { MobileModalWrapper } from '../layouts/MobileModalWrapper'
import { useAccountStakeInfo } from '../../hooks/useAccountStakeInfo'
import { Constants } from '../../utils/constants'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export const StakeDisplay = () => {
  const addressRef = useRef<HTMLSpanElement>(null)
  const { address, isConnected } = useAccount()
  const { stakeInfo } = useAccountStakeInfo(address)
  const { chain } = useNetwork()
  const { nodeStatus } = useNodeStatus()
  const { setShowModal, setContent, resetModal } = useModalStore((state: any) => ({
    setShowModal: state.setShowModal,
    setContent: state.setContent,
    resetModal: state.resetModal,
  }))
  const [hasNodeStopped, setHasNodeStopped] = useState(false)
  const [lastUnstake] = useLocalStorage(Constants.UNSTAKE_COOLDOWN_KEY, '0')

  useEffect(() => {
    if (nodeStatus?.state === 'stopped') {
      setHasNodeStopped(true)
    } else {
      setHasNodeStopped(false)
    }
  }, [nodeStatus?.state])

  const formatRemainingTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    let seconds = Math.floor((ms % 60000) / 1000)

    if (minutes === 0 && seconds === 0) {
      // Never show "0m 0s". This should only occur if the number of ms is less than 1000.
      seconds = 1
    }
    return `${minutes}m ${seconds}s`
  }

  const stakeForConnectedAddressOrNode = parseFloat(stakeInfo?.stake?.trim() || nodeStatus?.lockedStake || '0')
  const isConnectedToNonNominee =
    nodeStatus?.nominatorAddress != null &&
    nodeStatus.nominatorAddress !== '' &&
    nodeStatus.nominatorAddress.toLowerCase() !== address?.toLowerCase()
  const hasStakeOnDifferentNode =
    parseFloat(stakeInfo?.stake ?? '0.0') > parseFloat('0.0') &&
    nodeStatus?.nomineeAddress != null &&
    stakeInfo?.nominee !== nodeStatus?.nomineeAddress

  function calcCooldown() {
    // use Date.now, config from stakeInfo.unstakeInterval and lastUnstake to calculate the cooldown
    if (!stakeInfo || stakeInfo?.unstakeInterval == null || stakeInfo?.unstakeInterval <= 0) {
      return 0
    }
    const lastUnstakeTime = lastUnstake ? parseInt(lastUnstake) : 0
    const cooldown = stakeInfo.unstakeInterval - (Date.now() - lastUnstakeTime)
    return cooldown > 0 ? cooldown : 0
  }

  const cooldown = calcCooldown()
  const isStakeLocked = nodeStatus?.stakeState?.unlocked === false && nodeStatus?.stakeState?.remainingTime > 0
  const isRestakeForbidden = nodeStatus?.stakeable?.restakeAllowed === false && nodeStatus?.stakeable?.remainingTime > 0

  const isRemoveButtonDisabled =
    (!hasStakeOnDifferentNode && (!hasNodeStopped || !nodeStatus?.stakeState || !nodeStatus?.stakeState.unlocked)) ||
    (isConnectedToNonNominee && !hasStakeOnDifferentNode) ||
    stakeForConnectedAddressOrNode === 0 ||
    cooldown > 0

  function unstakeTooltip() {
    if (hasNodeStopped) {
      if (isStakeLocked) {
        return `Node is currently stopped and is being removed from the active validator list. Please wait for another ${formatRemainingTime(
          nodeStatus.stakeState.remainingTime
        )} before you can remove your stake.`
      }

      if (cooldown > 0) {
        return `You have recently removed your stake. Please wait for another ${formatRemainingTime(
          cooldown
        )} before you can remove your stake.`
      }
    }
    return 'It is not recommended to unstake while validating. If absolutely necessary, use the force remove option in settings to remove stake (Not Recommended).'
  }

  return (
    <Card>
      <>
        <div className="flex flex-col text-subtleFg">
          <div className={`flex flex-col gap-y-2 p-3`}>
            <span className="text-lg md:text-xl font-semibold">{stakeForConnectedAddressOrNode.toFixed(2)} SHM</span>
            <div className="flex gap-x-1 items-center">
              <span className="text-xs font-light">Min. requirement: </span>
              <span className="text-sm">{nodeStatus?.stakeRequirement || '—.—'} SHM</span>
            </div>
          </div>
          <hr className="my-1 mx-3" />
          <div className="flex flex-col p-3 gap-y-2">
            <span className="font-semibold text-sm">Stake Address</span>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-x-1">
                <span className="font-light text-xs" ref={addressRef}>
                  {nodeStatus?.nominatorAddress != null && nodeStatus?.nominatorAddress !== ''
                    ? nodeStatus?.nominatorAddress
                    : address}
                </span>
              </div>
              <button
                onClick={() => {
                  if (addressRef.current) {
                    navigator.clipboard.writeText(addressRef.current?.innerText || '')
                  }
                }}
                className="h-3 w-3"
              >
                <ClipboardIcon fillColor={'black'} />
              </button>
            </div>
            <div className="flex flex-col gap-y-3 mt-2">
              <div className="w-full">
                {isConnected && chain?.id === CHAIN_ID ? (
                  <div className="flex justify-end gap-x-2">
                    <button
                      className={`
                        bg-white border border-bodyFg text-sm px-3 py-2 rounded basis-0 grow 
                        ${
                          !isRemoveButtonDisabled
                            ? nodeStatus?.stakeState?.unlocked
                              ? 'text-primary'
                              : 'text-yellow-500'
                            : 'text-gray-400'
                        }
                        ${isRemoveButtonDisabled ? 'tooltip tooltip-bottom' : ''}
                      `}
                      data-tip={unstakeTooltip()}
                      disabled={isRemoveButtonDisabled}
                      onClick={() => {
                        resetModal()
                        setContent(
                          <MobileModalWrapper
                            closeButtonRequired={false}
                            contentOnTop={false}
                            wrapperClassName="fixed bottom-0 flex flex-col items-center justify-start p-3 rounded-t-2xl min-h-2/3 overflow-scroll bg-white w-screen dropdown-300 text-black"
                          >
                            <ConfirmUnstakeModal
                              nominator={address?.toString() || ''}
                              nominee={stakeInfo?.nominee || ''}
                              isNormalUnstake={true}
                              currentRewards={parseFloat(stakeInfo?.rewards ?? '0')}
                              currentStake={stakeForConnectedAddressOrNode}
                            ></ConfirmUnstakeModal>
                          </MobileModalWrapper>
                        )
                        setShowModal(true)
                      }}
                    >
                      Remove Stake
                    </button>
                    <button
                      className={
                        'px-3 py-2 rounded text-sm basis-0 grow max-w-[12rem] ' +
                        (hasNodeStopped || !nodeStatus?.nomineeAddress || isRestakeForbidden
                          ? 'text-gray-400 border border-bodyFg'
                          : 'bg-primary text-white')
                      }
                      disabled={
                        hasNodeStopped || !nodeStatus?.nomineeAddress || isRestakeForbidden || isConnectedToNonNominee
                      }
                      onClick={() => {
                        resetModal()
                        setContent(
                          <MobileModalWrapper closeButtonRequired={false} contentOnTop={false}>
                            <AddStakeModal />
                          </MobileModalWrapper>
                        )
                        setShowModal(true)
                      }}
                    >
                      Add Stake
                    </button>
                  </div>
                ) : (
                  <WalletConnectButton toShowAddress={false} label="Connect Wallet"></WalletConnectButton>
                )}
              </div>
            </div>
          </div>
        </div>
        {hasStakeOnDifferentNode && (
          <div className={`flex gap-x-2 items-center px-4 py-2 bg-dangerBg border-gray-200 border-t`}>
            <span className="bodyFg font-light text-xs ">
              This wallet already has an active stake on a different node. Remove your stake first if you wish to stake
              for the current node.
            </span>
          </div>
        )}
        {isRestakeForbidden && (
          <div className={`flex gap-x-2 items-center px-4 py-2 bg-dangerBg border-gray-200 border-t`}>
            <span className="bodyFg font-light text-xs ">
              Restaking is on cooldown. Please wait for another{' '}
              {formatRemainingTime(nodeStatus?.stakeable?.remainingTime)} before you can add more stake.
            </span>
          </div>
        )}
        {isConnectedToNonNominee && (
          <div className={`flex gap-x-2 items-center px-4 py-2 bg-dangerBg border-gray-200 border-t`}>
            <span className="bodyFg font-light text-xs ">This wallet is not the current staker of this node.</span>
          </div>
        )}
      </>
    </Card>
  )
}
