import { useEffect, useState } from "react";
import rewardsCardBg from "../../assets/rewards-card.png";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import { Card } from "../layouts/Card";
import { useAccount, useNetwork } from "wagmi";
import { CHAIN_ID } from "../../pages/_app";
import useModalStore from "../../hooks/useModalStore";
import { ConfirmRedemptionModal } from "./ConfirmRedemptionModal";
import { MobileModalWrapper } from "../layouts/MobileModalWrapper";
import { BgImage } from "../atoms/BgImage";

function formatDate(date: Date) {
  // Format date and time separately
  const datePart = date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Combine date and time parts
  return `${datePart} ${timePart}`;
}

export const RewardsCard = () => {
  const { setShowModal, setContent, resetModal } = useModalStore(
    (state: any) => ({
      setShowModal: state.setShowModal,
      setContent: state.setContent,
      resetModal: state.resetModal,
    })
  );
  const { nodeStatus } = useNodeStatus();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [canRedeem, setCanRedeem] = useState(
    isConnected &&
      chain?.id === CHAIN_ID &&
      nodeStatus?.state === "stopped" &&
      parseFloat(nodeStatus?.lockedStake || "0") > 0
  );
  useEffect(() => {
    setCanRedeem(
      isConnected &&
        chain?.id === CHAIN_ID &&
        nodeStatus?.state === "stopped" &&
        parseFloat(nodeStatus?.lockedStake || "0") > 0
    );
  }, [nodeStatus?.state, nodeStatus?.lockedStake, isConnected, chain?.id]);

  return (
    <Card>
      <div className="flex justify-between">
        <div className="flex flex-col px-5 py-4 gap-y-3 grow">
          <div className="flex w-full">
            <div className="flex justify-between w-full">
              <div className="flex flex-col w-full gap-y-2">
                <span className="font-semibold text-2xl flex gap-x-2">
                  <span>
                    {parseFloat(nodeStatus?.currentRewards || "0").toFixed(2)}{" "}
                    SHM
                  </span>
                  {/* <span className="text-xs leading-9 bodyFg">(~0.00$)</span> */}
                </span>
                <div className="text-xs flex justify-between w-full bodyFg">
                  <span>Earned since last validating cycle</span>
                  {nodeStatus?.lastActive && (
                    <span className="max-md:hidden">
                      {formatDate(new Date(nodeStatus?.lastActive))}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <hr className="mt-3" />
          <div className="flex justify-between">
            <span className="text-xs bodyFg">Total rewards earned</span>
            <span className="font-semibold text-xs">
              {nodeStatus?.lifetimeEarnings || (0.0).toFixed(2)} SHM
            </span>
          </div>
          <div>
            <button
              className={
                `border border-gray-400 mt-3 px-3 py-1 text-sm rounded ` +
                (canRedeem
                  ? "text-primary"
                  : `text-gray-400 ${
                      nodeStatus?.state === "active" ? "tooltip" : ""
                    }`)
              }
              data-tip="It is not possible to redeem rewards while you are validating.
              If absolutely necessary, use the force stop option in settings (Not Recommended)."
              disabled={!canRedeem}
              onClick={() => {
                resetModal();
                setContent(
                  <MobileModalWrapper
                    closeButtonRequired={false}
                    contentOnTop={false}
                  >
                    <ConfirmRedemptionModal
                      nominator={address?.toString() || ""}
                      nominee={nodeStatus?.nomineeAddress || ""}
                      currentRewards={parseFloat(
                        nodeStatus?.currentRewards || "0"
                      )}
                      currentStake={parseFloat(nodeStatus?.lockedStake || "0")}
                    ></ConfirmRedemptionModal>
                  </MobileModalWrapper>
                );
                setShowModal(true);
              }}
            >
              Redeem Rewards
            </button>
          </div>
        </div>
        <div className="w-full max-w-[8rem] max-md:hidden">
          <BgImage src={rewardsCardBg} alt="rewards-card-bg" />
        </div>
      </div>
    </Card>
  );
};
