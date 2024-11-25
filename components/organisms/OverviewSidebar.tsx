import { useAccount } from "wagmi";
import { NodeStatus } from "../molecules/NodeStatus";
import { StakeDisplay } from "../molecules/StakeDisplay";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { useNodeVersion } from "../../hooks/useNodeVersion";
import { useRef, useState } from "react";
import { SupportDisplay } from "../molecules/SupportDisplay";
import { NodeStatusUpdate } from "../atoms/NodeStatusUpdate";

export const OverviewSidebar: React.FC = () => {
  const renderCount = useRef(0);
  renderCount.current = renderCount.current + 1;

  const { isConnected, address } = useAccount();
  const { version } = useNodeVersion();
  const [areSupportOptionsVisible, setAreSupportOptionsVisible] =
    useState(false);

  const isGuiUpdatePending =
    version?.runningCliVersion !== version?.latestCliVersion;
  const isValidatorUpdatePending =
    version?.runnningValidatorVersion !== version?.activeShardeumVersion;

  return (
    <div className="flex flex-col gap-y-16 scroll-smooth">
      <div className="flex flex-col gap-y-2">
        <span className="font-semibold">Node Status</span>
        <div className="flex flex-col shadow border border-gray-200 rounded">
          <div className="z-30">
            <NodeStatus
              isWalletConnected={isConnected}
              address={address || ""}
            />
          </div>
          <div className="relative">
            <NodeStatusUpdate />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <span className="font-semibold">Your Stake</span>
        <div className="flex flex-col shadow border border-gray-200 rounded">
          <StakeDisplay />
        </div>
      </div>
      <div className="flex flex-col gap-y-1 font-light text-black">
        <span className="text-xs font-medium">Version Info</span>
        <div className="flex mt-1 justify-between items-center">
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2">
              <div
                className={
                  "rounded-full h-2 w-2 flex items-center justify-center " +
                  (isGuiUpdatePending
                    ? "bg-severeBorder tooltip"
                    : "bg-successBorder")
                }
              >
                <div
                  className={
                    "rounded-full h-1 w-1 " +
                    (isGuiUpdatePending ? "bg-severeFg" : "bg-successFg")
                  }
                ></div>
              </div>
              <span
                className={`font-light text-xs ${
                  isGuiUpdatePending ? "tooltip" : ""
                }`}
                data-tip={`Your GUI version is out of date. Please update to the latest version (${version?.latestCliVersion})`}
              >
                GUI Version <u>{version?.runningGuiVersion}</u>
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <div
                className={
                  "rounded-full h-2 w-2 flex items-center justify-center " +
                  (isValidatorUpdatePending
                    ? "bg-severeBorder"
                    : "bg-successBorder")
                }
              >
                <div
                  className={
                    "rounded-full h-1 w-1 " +
                    (isValidatorUpdatePending
                      ? "bg-severeFg tooltip"
                      : "bg-successFg")
                  }
                  data-tip={`Your validator version is out of date. Please update to the latest version (${version?.activeShardeumVersion})`}
                ></div>
              </div>
              <span
                className={`font-light text-xs ${
                  isGuiUpdatePending ? "tooltip" : ""
                }`}
                data-tip={`Your Validator version is out of date. Please update to the latest version (${version?.activeShardeumVersion})`}
              >
                Validator Version <u>{version?.runnningValidatorVersion}</u>
              </span>
            </div>
          </div>
          <div className="flex justify-center items-center relative">
            <QuestionMarkCircleIcon
              className="h-10 w-10 cursor-pointer"
              onClick={() => {
                setAreSupportOptionsVisible((prevState) => !prevState);
              }}
            />
            <SupportDisplay
              isVisible={areSupportOptionsVisible}
              onClose={() => {
                setAreSupportOptionsVisible(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
