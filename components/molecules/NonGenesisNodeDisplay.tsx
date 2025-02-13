import Link from "next/link";
import greyLogo from "../../assets/grey-logo.svg";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import { ErrorIcon } from "../atoms/ErrorIcon";

export const NonGenesisNodeDisplay = () => {
  const { nodeStatus } = useNodeStatus();
  const isGenesisNode = nodeStatus?.isGenesisNode;
  return (
    !isGenesisNode && (
      <div className="flex flex-col gap-y-3">
        <div className="w-full h-full border shadow rounded p-4 bg-white max-md:hidden">
          <div className="flex">
            <div className="flex flex-col grow gap-x-3">
              <div className="text-sm font-semibold">
                <ErrorIcon
                  className="rounded-full h-14 w-14 p-2 inline"
                  fillColor="rgb(178, 161, 0)"
                />
                No Genesis Node License Detected
              </div>
              <div className="flex justify-start mt-3">
                <span className="bodyFg text-xs font-light">
                  You need to have a Genesis Node license in order to join as a
                  validator on Shardeum. Please click <Link href="">here </Link>
                  to purchase a Genesis node license.
                </span>
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
          </div>
        </div>
      </div>
    )
  );
};
