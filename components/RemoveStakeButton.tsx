import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { ToastContext } from './ToastContextProvider';
import { useTXLogs } from "../hooks/useTXLogs";
import LoadingButton from './LoadingButton';
import { ConfirmModalContext } from './ConfirmModalContextProvider';
import { isMetaMaskError } from '../utils/isMetaMaskError';
import { isEthersError } from '../utils/isEthersError';
import { ExternalProvider } from '@ethersproject/providers';
import { NodeStatus } from '../model/node-status'
import { useSettings } from "../hooks/useSettings";
import { Address } from 'viem'

export default function RemoveStakeButton({nominee, force = false, nodeStatus}: { nominee: string, force?: boolean, nodeStatus: NodeStatus['state'] }) {
  const {showTemporarySuccessMessage, showErrorDetails, showTemporaryWarningMessage} = useContext(ToastContext);
  const {writeUnstakeLog} = useTXLogs()
  const {openModal} = useContext(ConfirmModalContext);
  const { settings, mutate: mutateSettings } = useSettings();
  const ethereum = window.ethereum;

  const createUnstakeLog = (data: unknown, params: { data: unknown }, hash: string, sender: string) => {
    params.data = data
    const logData = {
      tx: params,
      sender,
      txHash: hash
    }

    return JSON.stringify(logData)
  }

  const sendTransaction = async (nominator: string, nominee: string, force: boolean) => {
    if (!ethereum) {
      throw new Error('MetaMask not found');
    }
    try {
      const provider = new ethers.providers.Web3Provider(ethereum as unknown as ExternalProvider);
      const signer = provider.getSigner();
      const [gasPrice, from, nonce] = await Promise.all([
        signer.getGasPrice(),
        signer.getAddress(),
        signer.getTransactionCount()
      ]);

      const unstakeData = {
        isInternalTx: true,
        internalTXType: 7,
        nominator,
        timestamp: Date.now(),
        nominee,
        force
      };
      console.log("Unstake Data", unstakeData);

      const params = {
        from,
        to: '0x0000000000000000000000000000000000010000',
        gasPrice,
        data: ethers.utils.hexlify(
          ethers.utils.toUtf8Bytes(JSON.stringify(unstakeData))
        ),
        nonce
      };
      console.log("Params: ", params);

      const {hash, data, wait} = await signer.sendTransaction(params);
      console.log("TX RECEIPT: ", {hash, data});
      await writeUnstakeLog(createUnstakeLog(unstakeData, params, hash, from))

      const txConfirmation = await wait();
      console.log("TX CONFRIMED: ", txConfirmation);
      showTemporarySuccessMessage('Remove stake successful!');
      setLoading(false);
    } catch (error) {
      console.error(error);
      let errorMessage = (error as Error)?.message || String(error);

      // 4001 is the error code for when a user rejects a transaction
      if ((isMetaMaskError(error) && error.code === 4001)
      || (isEthersError(error) && error.code === 'ACTION_REJECTED')) {
        errorMessage = 'Transaction rejected by user';
      }
      showErrorDetails(errorMessage);
    }
    setLoading(false);
  };

  const [haveMetamask, sethaveMetamask] = useState(false);
  const [accountAddress, setAccountAddress] = useState("");

  useEffect(() => {
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      } else sethaveMetamask(true);
    };
    checkMetamaskAvailability();
  }, [ethereum]);

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      }) as Address[];
      if (accounts && accounts.length > 0) {
        setAccountAddress(accounts[0]);

        console.log("Account2: ", accountAddress);
        await sendTransaction(accounts[0], nominee, force);
      } else {
        console.error('Invalid accounts array:', accounts);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({
    isInternalTx: true,
    internalTXType: 7,
    nominator: accountAddress,
    timestamp: Date.now()
  });

  ethereum?.on?.("accountsChanged", (args: unknown) => {
    const accounts = args as Address[]; 
    if (accounts && accounts.length > 0) {
      setData({...data, nominator: accounts[0]});
    } else {
      console.error('Invalid accounts array:', accounts);
    }
  });

  async function removeStake() {
    setLoading(true);
    await connectWallet();
  }


  const handleRemoveStake = async () => {

    await mutateSettings();

    if (
      settings?.lastStopped &&
      Date.now() - settings.lastStopped < 15 * 60000 // 15 minutes
    ) {
      showTemporaryWarningMessage(" Your node has been stopped recently. Please wait for at least 15 minutes before removing stake.");
      return;
    }

    if (force) {
      openModal({
        header: 'Force Remove Stake',
        modalBody: (
          <>
            You are about to force remove your staked funds. This can be used to retrieve stake that is otherwise
             stuck.
            <br/>
            <span className='font-semibold'>WARNING</span>: Pending rewards can get lost when using this option!
          </>
        ),
        onConfirm: () => removeStake()
      });
    } else {
      removeStake()
    }
  }

  return (
    <>
      {haveMetamask ? (
        <>
          <div>
            <LoadingButton className="btn btn-primary"
              isLoading={isLoading}
              disabled={!force && (nodeStatus === 'waiting-for-network' || nodeStatus === 'standby' || nodeStatus === 'syncing' || nodeStatus === 'active')}
              onClick={() => handleRemoveStake()}>
              Remove Stake
              <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
            </LoadingButton>
          </div>
        </>
      ) : (
        <div className="text-red-500">Please install a Web3 Wallet</div>
      )}
    </>
  );
}