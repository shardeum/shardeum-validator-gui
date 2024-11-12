import { Card } from "../layouts/Card";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import useModalStore from "../../hooks/useModalStore";
import { AddStakeModal } from "./AddStakeModal";
import { CHAIN_ID } from "../../pages/_app";
import { WalletConnectButton } from "./WalletConnectButton";
import { ConfirmUnstakeModal } from "./ConfirmUnstakeModal";
import { ClipboardIcon } from "../atoms/ClipboardIcon";
import { MobileModalWrapper } from "../layouts/MobileModalWrapper";
import { useAccountStakeInfo } from "../../hooks/useAccountStakeInfo";
import { useSettings } from "../../hooks/useSettings";

export const StakeDisplay = () => {
  const addressRef = useRef<HTMLSpanElement>(null);
  const { address, isConnected } = useAccount();
  const { stakeInfo } = useAccountStakeInfo(address);
  const { chain } = useNetwork();
  const { nodeStatus } = useNodeStatus();
  const { settings } = useSettings();
  const { setShowModal, setContent, resetModal } = useModalStore(
    (state: any) => ({
      setShowModal: state.setShowModal,
      setContent: state.setContent,
      resetModal: state.resetModal,
    })
  );
  const [hasNodeStopped, setHasNodeStopped] = useState(false);

  const minimumStakeRequirement = useMemo(() => {
    return Math.max(
      parseFloat(nodeStatus?.stakeRequirement || "10") -
        parseFloat(nodeStatus?.lockedStake || "0"),
      0
    );
  }, [nodeStatus?.stakeRequirement, nodeStatus?.lockedStake]);

  useEffect(() => {
    if (nodeStatus?.state === "stopped") {
      setHasNodeStopped(true);
    } else {
      setHasNodeStopped(false);
    }
  }, [nodeStatus?.state]);

  const { isStoppedForLongerThan15Minutes, remainingWaitTime } = useMemo(() => {
    if (!settings?.lastStopped) return { isStoppedForLongerThan15Minutes: false, remainingWaitTime: 0 };
    const timeDifference = Date.now() - settings.lastStopped;
    const isStoppedForLongerThan15Minutes = timeDifference > 15 * 60 * 1000;
    const remainingWaitTime = Math.max(15 * 60 * 1000 - timeDifference, 0);
    return { isStoppedForLongerThan15Minutes, remainingWaitTime };
  }, [settings?.lastStopped]);

  const formatRemainingTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card>
      <div className="flex flex-col text-subtleFg">
        <div className={`flex flex-col gap-y-2 p-3 font-semibold text-xl`}>
          <span>
            {parseFloat(
              nodeStatus?.lockedStake ? nodeStatus?.lockedStake : "0"
            ).toFixed(2)}{" "}
            SHM
          </span>
          <div className="flex gap-x-1">
            <span className="font-light text-xs">Min. requirement: </span>
            <span className="text-xs">{minimumStakeRequirement} SHM</span>
          </div>
        </div>
        <hr className="my-1 mx-3" />
        <div className="flex flex-col p-3 gap-y-2">
          <span className="font-semibold text-sm">Stake Address</span>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-1">
              <span className="font-light text-xs" ref={addressRef}>
                {address}
              </span>
            </div>
            <button
              onClick={() => {
                if (addressRef.current) {
                  navigator.clipboard.writeText(
                    addressRef.current?.innerText || ""
                  );
                }
              }}
              className="h-3 w-3"
            >
              <ClipboardIcon fillColor={"black"} />
            </button>
          </div>
          <div className="flex flex-col gap-y-3 mt-2">
            <div className="w-full">
              {isConnected && chain?.id === CHAIN_ID ? (
                <div className="flex justify-end gap-x-2">
                  <button
                    className={`
                      bg-white border border-bodyFg text-sm px-3 py-2 rounded basis-0 grow 
                      ${hasNodeStopped && parseFloat(nodeStatus?.lockedStake || "0") > 0
                        ? isStoppedForLongerThan15Minutes
                          ? "text-primary"
                          : "text-yellow-500"
                        : "text-gray-400"
                      }
                      ${!isStoppedForLongerThan15Minutes && parseFloat(nodeStatus?.lockedStake || "0") > 0 ? "tooltip tooltip-bottom" : ""}
                    `}
                    data-tip={
                      hasNodeStopped && !isStoppedForLongerThan15Minutes
                        ? `Node is currently stopped and is being removed from the active validator list. Please wait for another ${formatRemainingTime(remainingWaitTime)} before you can remove your stake.`
                        : "It is not recommended to unstake while validating. If absolutely necessary, use the force remove option in settings to remove stake (Not Recommended)."
                    }
                    disabled={
                      !hasNodeStopped ||
                      parseFloat(nodeStatus?.lockedStake || "0") === 0 ||
                      !isStoppedForLongerThan15Minutes
                    }
                    onClick={() => {
                      resetModal();
                      setContent(
                        <MobileModalWrapper
                          closeButtonRequired={false}
                          contentOnTop={false}
                          wrapperClassName="fixed bottom-0 flex flex-col items-center justify-start p-3 rounded-t-2xl min-h-2/3 overflow-scroll bg-white w-screen dropdown-300 text-black"
                        >
                          <ConfirmUnstakeModal
                            nominator={address?.toString() || ""}
                            nominee={stakeInfo?.nominee || ""}
                            isNormalUnstake={hasNodeStopped}
                            currentRewards={parseFloat(
                              nodeStatus?.currentRewards || "0"
                            )}
                            currentStake={parseFloat(
                              nodeStatus?.lockedStake || "0"
                            )}
                          ></ConfirmUnstakeModal>
                        </MobileModalWrapper>
                      );
                      setShowModal(true);
                    }}
                  >
                    Remove Stake
                  </button>
                  <button
                    className={
                      "px-3 py-2 rounded text-sm basis-0 grow max-w-[12rem] " +
                      (hasNodeStopped || !nodeStatus?.nomineeAddress
                        ? "text-gray-400 border border-bodyFg"
                        : "bg-primary text-white")
                    }
                    disabled={hasNodeStopped || !nodeStatus?.nomineeAddress}
                    onClick={() => {
                      resetModal();
                      setContent(
                        <MobileModalWrapper
                          closeButtonRequired={false}
                          contentOnTop={false}
                        >
                          <AddStakeModal />
                        </MobileModalWrapper>
                      );
                      setShowModal(true);
                    }}
                  >
                    Add Stake
                  </button>
                </div>
              ) : (
                <WalletConnectButton
                  toShowAddress={false}
                  label="Connect Wallet"
                ></WalletConnectButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};