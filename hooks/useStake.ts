import { ChangeEvent, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useTXLogs } from './useTXLogs'
import { isMetaMaskError } from '../utils/isMetaMaskError'
import { isEthersError } from '../utils/isEthersError'
import { ExternalProvider } from '@ethersproject/providers'

type useStakeProps = {
  nominator: string
  nominee: string
  stakeAmount: string
  onStake?: (wasTxnSuccessful: boolean) => void
  totalStaked: number
}

type StakeData = {
  isInternalTx: boolean
  internalTXType: number
  nominator: string
  nominee: string
  stake: string
  timestamp: number
  stakeOk: boolean
}

export const useStake = ({ nominator, nominee, stakeAmount, onStake, totalStaked }: useStakeProps) => {
  const requiredStake = ethers.utils.parseEther(stakeAmount).toString()
  const ethereum = window.ethereum
  const { writeStakeLog } = useTXLogs()
  const [isLoading, setLoading] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)
  const [nomineeAddress, setNomineeAddress] = useState<string>(nominee)
  const [data, setData] = useState<StakeData>({
    isInternalTx: true,
    internalTXType: 6,
    nominator: nominator.toLowerCase(),
    nominee: nomineeAddress,
    stake: requiredStake,
    timestamp: Date.now(),
    stakeOk: true,
  })

  const createStakeLog = (_data: string, params: { data: unknown }, hash: string, sender: string) => {
    params.data = JSON.parse(_data)
    const logData = {
      tx: params,
      sender,
      txHash: hash,
    }

    return JSON.stringify(logData)
  }

  async function sendTransaction() {
    setLoading(true)
    let errorFlag = false
    let wasTxnSuccessful = false
    try {
      const blobData: string = JSON.stringify({ ...data, nominee: nomineeAddress })
      const provider = new ethers.providers.Web3Provider(ethereum as ExternalProvider)
      const signer = provider.getSigner()
      const [gasPrice, from, nonce] = await Promise.all([
        signer.getGasPrice(),
        signer.getAddress(),
        signer.getTransactionCount(),
      ])
      console.log('BLOB: ', blobData)
      console.log(stakeAmount, totalStaked)
      const value = ethers.BigNumber.from(data.stake)

      const totalStakeBigNumber = ethers.BigNumber.from(totalStaked)
      const stakeAmountBigNumber = ethers.utils.parseUnits(stakeAmount, 'ether')

      console.log(totalStakeBigNumber, stakeAmountBigNumber)
      if (totalStakeBigNumber.lt(stakeAmountBigNumber) && value.lt(stakeAmountBigNumber)) {
        errorFlag = true
        throw new Error('Stake Amount should be greater than the required stake')
      }
      const params = {
        from,
        to: '0x0000000000000000000000000000000000010000',
        gasPrice,
        value,
        data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(blobData)),
        nonce,
      }
      console.log('Params: ', params)

      const { hash, data: resultData, wait } = await signer.sendTransaction(params)
      console.log('TX RECEIPT: ', { hash, resultData })
      await writeStakeLog(createStakeLog(blobData, params, hash, from))

      const txConfirmation = await wait()
      console.log('TX CONFRIMED: ', txConfirmation)
      wasTxnSuccessful = txConfirmation.status === 1
      console.log()
    } catch (error: unknown) {
      console.error(error)
      if (errorFlag) {
        onStake?.(false)
        setLoading(false)
        return
      }
    }
    setLoading(false)
    onStake?.(wasTxnSuccessful)
  }

  useEffect(() => {
    ethereum?.on?.('accountsChanged', (accounts: string[]) => {
      setData((currentData) => ({
        ...currentData,
        nominator: (accounts?.[0] || '').toLowerCase(),
      }))
    })
    setData((currentData) => ({
      ...currentData,
      stake: '0',
    }))
  }, [requiredStake, ethereum])

  function handleStakeChange(e: ChangeEvent<HTMLInputElement>) {
    try {
      const newValue = e.target.value.toString()
      setIsEmpty(!newValue)
      const stake = ethers.utils.parseEther(newValue).toString()
      setData({
        ...data,
        stake,
        stakeOk: true,
      })
    } catch (e) {
      console.error(e)
      setData({
        ...data,
        stakeOk: false,
      })
    }
  }

  return {
    sendTransaction,
    handleStakeChange,
    setNomineeAddress,
    isEmpty,
    isLoading,
  }
}
