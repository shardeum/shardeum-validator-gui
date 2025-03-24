import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { ToastContext } from "./ToastContextProvider";
import { useTXLogs } from "../hooks/useTXLogs";
import LoadingButton from "./LoadingButton";
import { isMetaMaskError } from "../utils/isMetaMaskError";
import { isEthersError } from "../utils/isEthersError";
import { ExternalProvider } from "@ethersproject/providers";

interface StakeData {
  isInternalTx: boolean;
  internalTXType: number;
  nominator: string;
  nominee: string;
  stake: string;
  timestamp: number;
  stakeOk: boolean;
}

type StakeFormProps = {
  nominator: string;
  nominee: string;
  stakeAmount: string;
  onStake?: () => void;
  totalStaked: number;
};

export default function StakeForm({
  nominator,
  nominee,
  stakeAmount,
  onStake,
  totalStaked,
}: StakeFormProps) {
  const { showTemporarySuccessMessage, showErrorDetails } =
    useContext(ToastContext);
  const requiredStake = ethers.utils.parseEther(stakeAmount).toString();
  const ethereum = window.ethereum;
  const { writeStakeLog } = useTXLogs();
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<StakeData>({
    isInternalTx: true,
    internalTXType: 6,
    nominator: nominator.toLowerCase(),
    nominee,
    stake: requiredStake,
    timestamp: Date.now(),
    stakeOk: true,
  });

  const createStakeLog = (
    _data: string,
    params: { data: unknown },
    hash: string,
    sender: string
  ) => {
    params.data = JSON.parse(_data);
    const logData = {
      tx: params,
      sender,
      txHash: hash,
    };

    return JSON.stringify(logData);
  };

  async function sendTransaction() {
    setLoading(true);
    let errorFlag = false;
    try {
      const blobData: string = JSON.stringify(data);
      const provider = new ethers.providers.Web3Provider(
        ethereum as ExternalProvider
      );
      const signer = provider.getSigner();
      const [gasPrice, from, nonce] = await Promise.all([
        signer.getGasPrice(),
        signer.getAddress(),
        signer.getTransactionCount(),
      ]);
      console.log("BLOB: ", blobData);
      console.log(stakeAmount,totalStaked);
      const value = ethers.BigNumber.from(data.stake);

      const totalStakeBigNumber = ethers.utils.parseUnits(totalStaked.toString(), "ether")
      const stakeAmountBigNumber = ethers.utils.parseUnits(stakeAmount, "ether")
      
      console.log(totalStakeBigNumber, stakeAmountBigNumber)
      if (totalStakeBigNumber.lt(stakeAmountBigNumber) && value.lt(stakeAmountBigNumber)) {
        errorFlag = true;
        throw new Error(
          "Stake Amount should be greater than the required stake"
        );
      }
      const params = {
        from,
        to: "0x0000000000000000000000000000000000010000",
        gasPrice,
        value,
        data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(blobData)),
        nonce,
      };
      console.log("Params: ", params);

      const {
        hash,
        data: resultData,
        wait,
      } = await signer.sendTransaction(params);
      console.log("TX RECEIPT: ", { hash, resultData });
      await writeStakeLog(createStakeLog(blobData, params, hash, from));

      const txConfirmation = await wait();
      console.log("TX CONFRIMED: ", txConfirmation);
      showTemporarySuccessMessage("Stake successful!");
    } catch (error: unknown) {
      console.error(error);
      let errorMessage = (error as Error)?.message || String(error);

      // 4001 is the error code for when a user rejects a transaction
      if (
        (isMetaMaskError(error) && error.code === 4001) ||
        (isEthersError(error) && error.code === "ACTION_REJECTED")
      ) {
        errorMessage = "Transaction rejected by user";
      }
      showErrorDetails(errorMessage);
      if (errorFlag) {
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    onStake?.();
  }

  useEffect(() => {
    ethereum?.on?.("accountsChanged", (accounts: string[]) => {
      setData((currentData) => ({
        ...currentData,
        nominator: accounts[0].toLowerCase(),
      }));
    });
    setData((currentData) => ({
      ...currentData,
      stake: "0",
    }));
  }, [requiredStake, ethereum]);

  function handleStakeChange(e: ChangeEvent<HTMLInputElement>) {
    try {
      const newValue = e.target.value.toString();
      const stake = ethers.utils.parseEther(newValue).toString();
      setData({
        ...data,
        stake,
        stakeOk: true,
      });
    } catch (e) {
      console.error(e);
      setData({
        ...data,
        stakeOk: false,
      });
    }
  }

  return (
    <div>
      <label htmlFor="rewardWallet" className="block">
        Stake Wallet Address
      </label>
      <input
        id="rewardWallet"
        value={data.nominator}
        type="text"
        className="bg-white text-black p-3 mt-2 w-full block border border-black"
        disabled
      />
      <label className="block mt-4">Nominee Public Key</label>
      <input
        required
        type="text"
        name="nominee"
        className="bg-white text-black p-3 mt-2 w-full block border border-black"
        placeholder="Nominee Public Key"
        value={data.nominee}
        onChange={(e) =>
          setData({ ...data, nominee: e.target.value.toLowerCase() })
        }
      />
      <label className="block mt-4">Stake Amount (SHM)</label>
      <input
        required
        type="text"
        name="stake"
        className="bg-white text-black p-3 mt-2 w-full border border-black"
        placeholder="Stake Amount (SHM)"
        onChange={(e) => handleStakeChange(e)}
      />
      <div
        className={`flex items-center mb-5 ${
          !data.stakeOk ? "text-red-500" : ""
        }`}
      >
        <div className="ml-2 font-semibold">
          Stake requirement: {stakeAmount}
        </div>
      </div>

      <div className="mt-5 float-right">
        <LoadingButton
          onClick={async () => sendTransaction()}
          isLoading={isLoading}
          className={`btn btn-primary ${
            isLoading || !data.stakeOk ? "btn-disabled" : ""
          }`}
        >
          Stake
          <ArrowRightIcon className="h-5 w-5 inline ml-2" />
        </LoadingButton>
      </div>
    </div>
  );
}
