import { useEffect, useState } from 'react'

import { ethers } from 'ethers'
import { useTXLogs } from './useTXLogs'
import { isMetaMaskError } from '../utils/isMetaMaskError'
import { isEthersError } from '../utils/isEthersError'
import { ExternalProvider } from '@ethersproject/providers'
import { Address } from 'wagmi'
import { showErrorMessage, showSuccessMessage } from './useToastStore'
import { Constants } from '../utils/constants'
import { useLocalStorage } from './useLocalStorage'
import { useNodeStatus } from './useNodeStatus'
import { validateUnstakeEligibility } from '../utils/unstakeValidation'

type useStakeProps = {
  nominator: string
  nominee: string
  force: boolean
}

export const useUnstake = ({ nominator, nominee, force }: useStakeProps) => {
  const [, setLastUnstake] = useLocalStorage(Constants.UNSTAKE_COOLDOWN_KEY, '0')
  const { writeUnstakeLog } = useTXLogs()
  const { nodeStatus } = useNodeStatus()
  const ethereum = window.ethereum

  const createUnstakeLog = (data: unknown, params: { data: unknown }, hash: string, sender: string) => {
    params.data = data
    const logData = {
      tx: params,
      sender,
      txHash: hash,
    }

    return JSON.stringify(logData)
  }

  const sendTransaction = async (nominator: string, nominee: string, force: boolean) => {
    if (!ethereum) {
      throw new Error('MetaMask not found')
    }
    try {
      const provider = new ethers.providers.Web3Provider(ethereum as ExternalProvider)
      const signer = provider.getSigner()
      const [gasPrice, from, nonce] = await Promise.all([
        signer.getGasPrice(),
        signer.getAddress(),
        signer.getTransactionCount(),
      ])

      const unstakeData = {
        isInternalTx: true,
        internalTXType: 7,
        nominator: nominator.toLowerCase(),
        timestamp: Date.now(),
        nominee,
        force,
      }
      console.log('Unstake Data', unstakeData)

      const params = {
        from,
        to: '0x0000000000000000000000000000000000010000',
        gasPrice,
        data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(JSON.stringify(unstakeData))),
        nonce,
      }
      console.log('Params: ', params)

      const { hash, data, wait } = await signer.sendTransaction(params)
      setLastUnstake(Date.now().toString())
      console.log('TX RECEIPT: ', { hash, data })
      await writeUnstakeLog(createUnstakeLog(unstakeData, params, hash, from))

      const txConfirmation = await wait()
      console.log('TX CONFRIMED: ', txConfirmation)
      showSuccessMessage('Unstake successful!')
      setLoading(false)
      return true
    } catch (error) {
      console.error(error)
      let errorMessage = (error as Error)?.message || String(error)

      // 4001 is the error code for when a user rejects a transaction
      if (
        (isMetaMaskError(error) && error.code === 4001) ||
        (isEthersError(error) && error.code === 'ACTION_REJECTED')
      ) {
        errorMessage = 'Transaction rejected by user'
      } else if (isEthersError(error) && error.code === 'CALL_EXCEPTION') {
        errorMessage = 'Transaction failed: Your node may still be in the deregistration process. Please wait for deregistration to complete before unstaking.'
      }
      showErrorMessage(errorMessage)
    }
    setLoading(false)
    return false
  }

  const [, sethaveMetamask] = useState(false)

  useEffect(() => {
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false)
      } else sethaveMetamask(true)
    }
    checkMetamaskAvailability()
  }, [ethereum])

  const [isLoading, setLoading] = useState(false)
  const [data, setData] = useState({
    isInternalTx: true,
    internalTXType: 7,
    nominator: nominator,
    timestamp: Date.now(),
  })

  ethereum?.on?.('accountsChanged', (accounts: Address[]) => {
    setData({ ...data, nominator: accounts[0] })
  })

  const handleRemoveStake = async () => {
    setLoading(true)

    const validation = validateUnstakeEligibility(force, nodeStatus)
    if (!validation.canUnstake) {
      showErrorMessage(validation.errorMessage!)
      setLoading(false)
      return false
    }

    const wasUnstakeSuccessful = await sendTransaction(nominator, nominee, force)
    setLoading(false)
    return wasUnstakeSuccessful
  }

  return {
    handleRemoveStake,
    isLoading,
  }
}