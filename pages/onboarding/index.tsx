// src/pages/onboarding/index.tsx
import Head from "next/head";
import { ReactElement, useEffect, useMemo, useState } from "react";
import onboardingBg from "../../assets/onboarding-bg.svg";
import {
  BookOpenIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import { Logo } from "../../components/atoms/Logo";
import { useAccount, useNetwork, useSwitchNetwork, useDisconnect } from "wagmi";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import { fetchBalance } from "@wagmi/core";
import { CHAIN_ID } from "../_app";
import { useDevice } from "../../context/device";
import { useRouter } from "next/router";
import { WalletConnectButton } from "../../components/molecules/WalletConnectButton";
import { GeistSans } from "geist/font";
import Link from "next/link";
import { useGlobals } from "../../utils/globals";
import { useStake } from "../../hooks/useStake";
import { ToastWindow } from "../../components/molecules/ToastWindow";
import useToastStore, { ToastSeverity } from "../../hooks/useToastStore";
import {
  NotificationSeverity,
  NotificationType,
} from "../../hooks/useNotificationsStore";

const tokensClaimedByKey = "tokensClaimedBy";
export const onboardingCompletedKey = "onboardingCompleted";

export const VALIDATOR_GUI_FAQS_URL =
  process.env.VALIDATOR_GUI_FAQS_URL || "https://shardeum.org/faq/general";
export const VALIDATOR_GUI_DOCS_URL =
  process.env.VALIDATOR_GUI_DOCS_URL || "https://docs.shardeum.org";
export const FAUCET_CLAIM_DOCS_URL =
  process.env.FAUCET_CLAIM_DOCS_URL ||
  "https://docs.shardeum.org/docs/faucet/claim";

const Onboarding = () => {
  const [isNodeStarted, setIsNodeStarted] = useState(false);
  const [accountBalance, setAccountBalance] = useState("");
  const [chainId, setChainId] = useState(0);
  const [tokenClaimPhase, setTokenClaimPhase] = useState(0); // 0: hasn't claimed yet, 1: initiated request, 2: has claimed
  const { isConnected, address } = useAccount({
    onConnect: async (args) => {
      if (args?.address) {
        const balance = await fetchBalance({
          address: args?.address,
          chainId: CHAIN_ID,
        });
        setAccountBalance(`${balance?.formatted} ${balance?.symbol}`);
      }
    },
    onDisconnect: () => {
      setAccountBalance("");
    },
  });
  const [isStakingComplete, setIsStakingComplete] = useState(
    localStorage.getItem(onboardingCompletedKey) === "true"
  );
  const [stakedAmount, setStakedAmount] = useState(0);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const { setCurrentToast } = useToastStore((state: any) => ({
    setCurrentToast: state.setCurrentToast,
  }));

  useEffect(() => {
    const claimantAddress = localStorage.getItem(tokensClaimedByKey);
    setTokenClaimPhase(claimantAddress === address ? 2 : 0);
  }, [address]);

  const { chain } = useNetwork();

  useEffect(() => {
    setChainId(chain?.id || 0);
  }, [chain?.id]);

  const { switchNetwork } = useSwitchNetwork();
  const router = useRouter();
  const { isMobile } = useDevice();
  const { disconnect } = useDisconnect();
  const { nodeStatus, isLoading, startNode } = useNodeStatus();
  const minimumStakeRequirement = useMemo(() => {
    return Math.max(
      parseFloat(nodeStatus?.stakeRequirement || "10") -
        parseFloat(nodeStatus?.lockedStake || "0"),
      0
    );
  }, [nodeStatus?.stakeRequirement, nodeStatus?.lockedStake]);

  const {
    sendTransaction,
    handleStakeChange,
    setNomineeAddress,
    isEmpty,
    isLoading: isStaking,
  } = useStake({
    nominator: address?.toString() || "",
    nominee: nodeStatus?.nomineeAddress || "",
    stakeAmount: minimumStakeRequirement.toString(),
    totalStaked: nodeStatus?.lockedStake ? Number(nodeStatus?.lockedStake) : 0,
    onStake: (wasTxnSuccessful: boolean) => {
      setIsStakingComplete(wasTxnSuccessful);
    },
  });

  const { apiBase } = useGlobals();

  useEffect(() => {
    if (nodeStatus?.state && nodeStatus.state !== "stopped") {
      setIsNodeStarted(true);
    } else {
      setIsNodeStarted(false);
    }
  }, [nodeStatus?.state]);

  useEffect(() => {
    const nomineeAddress = nodeStatus?.nomineeAddress;
    if (nomineeAddress) {
      setNomineeAddress(nomineeAddress);
    }
  }, [nodeStatus?.nomineeAddress, setNomineeAddress]);

  useEffect(() => {
    if (isMobile) {
      router.push("/dashboard");
    }
  }, [isMobile]);

  useEffect(() => {
    if (isStakingComplete) {
      localStorage.setItem(onboardingCompletedKey, "true");
      setCurrentToast({
        severity: ToastSeverity.SUCCESS,
        title: "Stake Added",
        description: `${stakedAmount.toFixed(2)} SHM staked Successfully`,
        followupNotification: {
          title: "Stake Added",
          type: NotificationType.REWARD,
          severity: NotificationSeverity.SUCCESS,
        },
      });
      const delay = setTimeout(() => {
        setShowSuccessScreen(true);
      }, 3000);

      return () => clearTimeout(delay);
    }
  }, [isStakingComplete]);

  useEffect(() => {
    if (isStaking) {
      setCurrentToast({
        severity: ToastSeverity.LOADING,
        title: "Processing Adding Stake",
        description: "Your add stake transaction is in process.",
        duration: 300000, // 300 seconds
      });
    }
  }, [isStaking]);

  const claimTokens = async (address: string) => {
    const claimUrl = `${apiBase}/api/claim-tokens?address=${address}`;
    const claimResponse = await fetch(claimUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await claimResponse.json();
    const tokenClaimComplete = data && data?.transfer;
    if (tokenClaimComplete) {
      localStorage.setItem(tokensClaimedByKey, address);
    } else {
      setCurrentToast({
        severity: ToastSeverity.DANGER,
        title: "Claiming Unsuccessful",
        description: data?.message,
        followupNotification: {
          title: "Claiming SHM Unsuccessful",
          type: NotificationType.REWARD,
          severity: NotificationSeverity.DANGER,
        },
      });
    }
    return tokenClaimComplete;
  };

  return (
    <div
      className={
        "h-full w-full flex justify-between text-black fill-bg py-24 " +
        GeistSans.className
      }
      style={{
        backgroundImage: `url(${onboardingBg.src})`,
      }}
    >
      {!showSuccessScreen && (
        <>
          {/* left pane */}
          <div className="h-full w-full max-w-xl flex flex-col ml-12 justify-between">
            <div className="h-full w-full flex flex-col items-center justify-between">
              <div className="max-w-sm">
                <span className="font-semibold text-3xl w-full">
                  Welcome to Shardeum Validator Setup
                </span>
                <div className="flex flex-col gap-y-3 mt-6">
                  <div className="flex gap-x-1 items-center">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="text-sm">
                      Connect to the Shardeum network step-by-step.
                    </span>
                  </div>
                  <div className="flex gap-x-1 items-center">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="text-sm">Get SHM tokens for staking.</span>
                  </div>
                  <div className="flex gap-x-1 items-center">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="text-sm">
                      Run a validator node by the end!
                    </span>
                  </div>
                </div>
                <hr className="h-1 rounded w-full max-w-sm my-3" />
                <span>Estimated Setup time Under 5 Minutes</span>
                <div className="mt-12">
                  <span className="font-semibold">Get Help</span>
                  <div className="flex mt-2">
                    <div className="flex items-center">
                      <div className="bg-black rounded-full w-5 h-5 flex justify-center items-center">
                        <BookOpenIcon className="text-white w-3 h-3" />
                      </div>
                      <Link
                        className="flex items-center"
                        href={VALIDATOR_GUI_DOCS_URL}
                        target="_blank"
                      >
                        <span className="ml-2 underline">Documentation</span>
                        <ArrowUpRightIcon className="h-5 ml-1" />
                      </Link>
                    </div>
                    <div className="flex items-center ml-4">
                      <QuestionMarkCircleIcon className="w-5 h-5" />
                      <Link
                        className="flex items-center"
                        href={VALIDATOR_GUI_FAQS_URL}
                        target="_blank"
                      >
                        <span className="ml-2 underline">FAQs</span>
                        <ArrowUpRightIcon className="h-5 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-start max-w-sm">
                <Logo className="w-32" />
              </div>
            </div>
          </div>

          {/* right pane */}
          <div className="grow h-full w-full">
            <div className="absolute top-0 right-60">
              <ToastWindow
                viewLogsOnClick={() => {
                  return;
                }}
                disableActions={true}
              />
            </div>
            <div className="w-full max-w-xl flex flex-col items-start gap-y-3">
              {/* Step 1: Connect wallet */}
              <div className="bg-white w-full border p-3 shadow-md rounded-sm">
                {!(isConnected && chainId === CHAIN_ID) && (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-x-2 max-w-xl">
                      <span className="flex items-center justify-center h-5 w-5 bg-primary rounded-full text-white text-xs">
                        1
                      </span>

                      <span className="font-semibold w-full flex items-center justify-between pr-5">
                        Connect your wallet
                      </span>
                    </div>
                    <div className="flex flex-col w-full pl-7">
                      <span className="font-light text-sm text-gray-600">
                        Connect your wallet and switch to Shardeum Atomium
                        Network.
                      </span>
                      <div className="flex flex-col mt-4 pr-5">
                        <div className="flex">
                          <div className="basis-0 grow text-white">
                            <WalletConnectButton label="Connect Wallet"></WalletConnectButton>
                          </div>
                          {isConnected && chainId !== CHAIN_ID && (
                            <div className="basis-0 grow">
                              <button
                                className={
                                  "ml-2 px-3 py-2 text-white text-sm rounded w-full " +
                                  (isConnected ? "bg-primary" : "bg-gray-400")
                                }
                                disabled={!isConnected}
                                onClick={() => switchNetwork?.(CHAIN_ID)}
                              >
                                2. Switch to Shardeum Atomium
                              </button>
                            </div>
                          )}
                        </div>
                        {isConnected && chainId !== CHAIN_ID && (
                          <div className="w-full flex text-xs justify-end mt-1 gap-x-1">
                            <span>Wrong wallet? </span>
                            <button
                              className="text-primary"
                              type="button"
                              onClick={() => {
                                console.log("Disconnecting", disconnect);
                                if (disconnect) {
                                  disconnect();
                                }
                              }}
                            >
                              Disconnect
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {isConnected && chainId === CHAIN_ID && (
                  <>
                    <div className="flex items-center gap-x-2 max-w-xl">
                      <CheckCircleIcon className="bg-white h-6 w-6 rounded-full text-xs text-green-700" />
                      <span className="font-semibold flex justify-between items-center w-full pr-5">
                        Successfully connected to the Shardeum Network
                      </span>
                    </div>
                    <span className="text-gray-600 text-sm ml-8">
                      {address &&
                        `${address.slice(0, 4)}...
                      ${address.slice(address.length - 5)} connected to the
                      network`}
                    </span>
                  </>
                )}
              </div>

              {/* Step 2: Claim tokens */}
              <div className="bg-white w-full border p-3 shadow-md rounded-sm">
                {isConnected && chainId === CHAIN_ID && tokenClaimPhase < 2 && (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-x-2 max-w-xl">
                      <span className="flex items-center justify-center h-5 w-5 bg-primary rounded-full text-white text-xs">
                        2
                      </span>
                      <span className="font-semibold w-full flex items-center justify-between pr-5">
                        Claim testnet tokens from faucet
                      </span>
                    </div>
                    <div className="flex flex-col w-full pl-7">
                      <span className="text-gray-600 text-sm">
                        Claim SHM tokens from Shardeum faucet as a reward.
                      </span>
                      <div className="flex flex-col mt-4 pr-5">
                        {tokenClaimPhase === 0 && (
                          <div className="flex">
                            <div className="basis-0 grow">
                              <button
                                className={
                                  "px-3 py-2 text-white text-sm font-semibold rounded w-full " +
                                  (isConnected ? "bg-primary" : "bg-gray-400")
                                }
                                disabled={!isConnected}
                                onClick={() => {
                                  if (window) {
                                    window.open(
                                      FAUCET_CLAIM_DOCS_URL,
                                      "_blank"
                                    );
                                  }
                                  setTokenClaimPhase(2);
                                }}
                              >
                                Claim SHM
                              </button>
                            </div>
                            <div className="basis-0 grow ml-2">
                              <button
                                className={
                                  "ml-2 px-3 py-2 text-primary text-sm font-semibold rounded w-full bg-white border border-gray-300"
                                }
                                disabled={!isConnected}
                                onClick={() => {
                                  localStorage.setItem(
                                    tokensClaimedByKey,
                                    address || ""
                                  );
                                  setTokenClaimPhase(2);
                                }}
                              >
                                I already have SHM to stake
                              </button>
                            </div>
                          </div>
                        )}
                        {tokenClaimPhase === 1 && (
                          <button
                            className="mt-2 border border-gray-300 rounded w-full px-4 py-2 flex items-center justify-center text-sm font-medium"
                            disabled={true}
                          >
                            <div className="spinner flex items-center justify-center mr-3">
                              <div className="border-2 border-black border-b-white rounded-full h-3.5 w-3.5"></div>
                            </div>{" "}
                            Claiming SHM
                          </button>
                        )}
                        {accountBalance !== "" && (
                          <div className="w-full flex text-xs justify-end mt-1 gap-x-1">
                            <span>Balance: </span>
                            <span className="font-semibold">
                              {accountBalance}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {isConnected &&
                  chainId === CHAIN_ID &&
                  tokenClaimPhase === 2 && (
                    <>
                      <div className="flex items-center gap-x-2">
                        <CheckCircleIcon className="bg-white h-6 w-6 rounded-full text-xs text-green-700" />
                        <span className="font-semibold flex justify-between items-center w-full pr-5">
                          Successfully claimed SHM
                        </span>
                      </div>
                      <span className="text-gray-600 text-sm ml-8">
                        You&apos;ve successfully claimed your reward SHM tokens.
                      </span>
                    </>
                  )}
                {!(isConnected && chainId === CHAIN_ID) && (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-x-2">
                      <span className="flex items-center justify-center bg-gray-400 h-5 w-5 rounded-full text-white text-sm">
                        2
                      </span>

                      <span className="font-medium text-gray-400">
                        Claim testnet tokens from faucet
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Start node */}
              <div className="bg-white w-full border p-3 shadow-md rounded-sm">
                {tokenClaimPhase === 2 && !isNodeStarted && (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-x-2 max-w-xl">
                      <span className="flex items-center justify-center h-5 w-5 bg-primary rounded-full text-white text-xs">
                        3
                      </span>

                      <span className="font-semibold w-full flex items-center justify-between pr-5">
                        Start your node
                      </span>
                    </div>
                    <div className="flex flex-col w-full pl-7">
                      <span className="font-light text-sm text-gray-600">
                        Start your node to be a part of the validation network.
                      </span>
                      <div className="flex flex-col mt-4 pr-5">
                        <div className="flex">
                          {!isLoading && (
                            <button
                              className="w-full bg-primary text-white text-sm px-4 py-2 rounded-sm mb-1"
                              onClick={async () => {
                                await startNode();
                                setIsNodeStarted(true);
                              }}
                            >
                              Start Node
                            </button>
                          )}
                          {isLoading && (
                            <button
                              className="border border-gray-300 rounded w-full px-4 py-2 flex items-center justify-center text-sm font-medium"
                              disabled={true}
                            >
                              <div className="spinner flex items-center justify-center mr-3">
                                <div className="border-2 border-black border-b-white rounded-full h-3.5 w-3.5"></div>
                              </div>{" "}
                              Starting Node
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tokenClaimPhase === 2 && isNodeStarted && (
                  <>
                    <div className="flex items-center gap-x-2 max-w-xl">
                      <CheckCircleIcon className="bg-white h-6 w-6 rounded-full text-xs text-green-700" />
                      <span className="font-semibold flex justify-between items-center w-full pr-5">
                        Node initiated successfully.
                      </span>
                    </div>
                    <span className="text-gray-600 text-sm ml-8">
                      Your node has been started and is waiting for stake
                    </span>
                  </>
                )}
                {tokenClaimPhase < 2 && (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-x-2">
                      <span className="flex items-center justify-center bg-gray-400 h-5 w-5 rounded-full text-white text-xs">
                        3
                      </span>

                      <span className="font-medium text-gray-400">
                        Start your node
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: Stake SHM */}
              <div className="bg-white w-full border p-3 shadow-md rounded-sm">
                {(!isConnected || tokenClaimPhase < 2 || !isNodeStarted) && (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-x-2">
                      <span className="flex items-center justify-center bg-gray-400 h-5 w-5 rounded-full text-white text-xs">
                        4
                      </span>

                      <span className="font-medium text-gray-400">
                        Stake your SHM
                      </span>
                    </div>
                  </div>
                )}
                {isConnected &&
                  tokenClaimPhase === 2 &&
                  isNodeStarted &&
                  !isStakingComplete && (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-x-2 max-w-xl">
                        <span className="flex items-center justify-center h-5 w-5 bg-primary rounded-full text-white text-xs">
                          4
                        </span>

                        <span className="font-semibold w-full flex items-center justify-between pr-5">
                          Stake your SHM
                        </span>
                      </div>
                      <div className="flex flex-col w-full pl-7">
                        <span className="font-light text-sm text-gray-600">
                          Stake SHM to become a validator & earn rewards.
                        </span>
                        <div className="flex flex-col mt-4 pr-5">
                          <div className="flex justify-between gap-x-2 bg-white">
                            <input
                              className="basis-0 grow bg-white border border-gray-300 shadow-sm rounded px-3 py-1"
                              placeholder="10"
                              type="number"
                              step="0.00000000000000000001"
                              min={minimumStakeRequirement}
                              disabled={isStaking}
                              onChange={(e) => {
                                const amount = e.target.value;
                                if (amount) {
                                  setStakedAmount(parseFloat(e.target.value));
                                }
                                handleStakeChange(e);
                              }}
                            ></input>
                            {!isStaking && (
                              <button
                                onClick={async () => {
                                  await sendTransaction();
                                }}
                                disabled={
                                  isEmpty ||
                                  stakedAmount < minimumStakeRequirement
                                }
                                className={
                                  (isEmpty ||
                                  stakedAmount < minimumStakeRequirement
                                    ? "bg-gray-300"
                                    : "bg-indigo-600 hover:bg-indigo-700") +
                                  " text-white text-sm font-semibold w-32 py-2 rounded flex justify-center ease-in-out duration-300 " +
                                  GeistSans.className
                                }
                              >
                                Stake
                              </button>
                            )}
                            {isStaking && (
                              <button
                                className="border border-gray-300 rounded w-32 py-2 flex items-center justify-center text-sm font-medium"
                                disabled={true}
                              >
                                <div className="spinner flex items-center justify-center mr-3">
                                  <div className="border-2 border-black border-b-white rounded-full h-3.5 w-3.5"></div>
                                </div>{" "}
                                Confirming
                              </button>
                            )}
                          </div>
                          <div className="flex flex-col w-full mt-2">
                            <div className="flex items-center"></div>
                            <div className="flex justify-between">
                              <div
                                className={`text-xs ${
                                  stakedAmount < minimumStakeRequirement
                                    ? "text-dangerFg"
                                    : ""
                                }`}
                              >
                                <span>Minimum stake requirement: </span>
                                <span className="font-semibold">
                                  {minimumStakeRequirement.toFixed(0)} SHM
                                </span>
                              </div>
                              {accountBalance !== "" && (
                                <div className="text-xs">
                                  <span>Balance: </span>
                                  <span className="font-semibold">
                                    {accountBalance}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                {isConnected &&
                  tokenClaimPhase === 2 &&
                  isNodeStarted &&
                  isStakingComplete && (
                    <>
                      <div className="flex items-center gap-x-2 max-w-xl">
                        <CheckCircleIcon className="bg-white h-6 w-6 rounded-full text-xs text-green-700" />
                        <span className="font-semibold flex justify-between items-center w-full pr-5">
                          Successfully staked SHM
                        </span>
                      </div>
                      <span className="text-gray-600 text-sm ml-8">
                        You&apos;ve successfully staked {stakedAmount} SHM.
                      </span>
                    </>
                  )}
              </div>

              {/* Skip all */}
              <div className="flex w-full justify-end my-2">
                <button
                  className="text-xs font-semibold"
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                >
                  Skip setup for now
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {showSuccessScreen && (
        <div className="flex flex-col h-full w-full justify-center items-center">
          <div className="bg-white max-w-sm flex flex-col justify-center items-center p-8 -translate-y-12 border shadow-md gap-y-3">
            <span className="text-md w-full text-center font-semibold">
              Congratulations! You successfully setup your Shardeum node.
            </span>
            <button
              className="bg-primary px-4 py-2 w-full text-white text-sm rounded"
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              Go to Dashboard
            </button>
          </div>
          <div className="w-full flex justify-center">
            <Logo className="w-32"></Logo>
          </div>
        </div>
      )}
    </div>
  );
};

Onboarding.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Shardeum Dashboard</title>
        <meta
          name="description"
          content="Dashboard to configure a Shardeum validator"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <div className="h-screen w-screen flex center relative bg-[#FAFAFA]">
        {page}
      </div>
    </>
  );
};

export default Onboarding;
