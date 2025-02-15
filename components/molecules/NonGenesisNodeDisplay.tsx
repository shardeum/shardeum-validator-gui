import Link from "next/link";
import greyLogo from "../../assets/grey-logo.svg";
import { ErrorIcon } from "../atoms/ErrorIcon";
import { useGenesisStatus } from "../../hooks/useGenesisStatus";
import { useState, useEffect } from "react";

export const NonGenesisNodeDisplay = () => {
  const ethereum = window.ethereum;
  const [currentWallet, setCurrentWallet] = useState<string | null>(null);

  useEffect(() => {
    async function getActiveWallet() {
      if (ethereum) {
        try {
          const accounts: string[] = await ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setCurrentWallet(accounts[0]);
          }
        } catch (error) {
          console.error("Failed to get accounts", error);
        }
      }
    }
    getActiveWallet();

    if (ethereum?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setCurrentWallet(accounts[0]);
        } else {
          setCurrentWallet(null);
        }
      };
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, [ethereum]);

  const { isGenesisNode } = useGenesisStatus(currentWallet);

  return (
    !isGenesisNode && (
      <div className="flex flex-col gap-y-3">
        <div className="w-full h-full border shadow rounded px-5 py-4 bg-white max-md:hidden">
          <div className="flex">
            <div className="flex flex-col grow gap-x-3">
              <div className="text-sm font-semibold">
                <ErrorIcon
                  className="rounded-full h-14 w-14 p-2 inline"
                  fillColor="rgb(178, 161, 0)"
                />
                No Genesis Node License Detected
              </div>
              <div className="flex flex-col justify-start mt-1 mx-4">
                <span className="bodyFg">
                  In the beginning, you need to have a{" "}
                  <b>Genesis Node license</b> in order to join as a validator on
                  Shardeum.
                </span>
                <span className="bodyFg">
                  If you have a <b>Genesis Node license</b>, please make sure
                  you are connected to the correct wallet.
                </span>
                <hr className="my-1 mt-5 mb-5" />
                <div className="flex justify-end">
                  <a
                    href="https://ADDTHELICENSELINKHERE.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="max-w-[12rem] w-full"
                  >
                    <button className="w-full px-3 py-2 rounded text-sm bg-primary text-white">
                      Purchase License
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
