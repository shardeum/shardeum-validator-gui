// src/pages/onboarding/index.tsx
import Head from 'next/head'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import onboardingBg from '../../assets/onboarding-bg.svg'
import { BookOpenIcon, CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import { ArrowUpRightIcon } from '@heroicons/react/20/solid'
import { Logo } from '../../components/atoms/Logo'
import { useAccount, useNetwork, useSwitchNetwork, useDisconnect } from 'wagmi'
import { useNodeStatus } from '../../hooks/useNodeStatus'
import { fetchBalance } from '@wagmi/core'
import { CHAIN_ID } from '../_app'
import { useDevice } from '../../context/device'
import { useRouter } from 'next/router'
import { GeistSans } from 'geist/font'
import Link from 'next/link'
import { useStake } from '../../hooks/useStake'
import { ToastWindow } from '../../components/molecules/ToastWindow'
import useToastStore, { ToastSeverity } from '../../hooks/useToastStore'
import { NotificationSeverity, NotificationType } from '../../hooks/useNotificationsStore'
import { WalletConnectStep } from '../../components/onboarding/WalletConnectStep'
import { ClaimTokensStep } from '../../components/onboarding/ClaimTokensStep'
import { StakeStep } from '../../components/onboarding/StakeStep'
import { StartNodeStep } from '../../components/onboarding/StartNodeStep'

const tokensClaimedByKey = 'tokensClaimedBy'
export const onboardingCompletedKey = 'onboardingCompleted'

export const VALIDATOR_GUI_FAQS_URL = process.env.VALIDATOR_GUI_FAQS_URL || 'https://shardeum.org/faq/general'
export const VALIDATOR_GUI_DOCS_URL = process.env.VALIDATOR_GUI_DOCS_URL || 'https://docs.shardeum.org'
export const FAUCET_CLAIM_DOCS_URL = process.env.FAUCET_CLAIM_DOCS_URL || 'https://docs.shardeum.org/docs/faucet/claim'

type OnboardingStep = {
  id: string
  title: string
  description: string
  isEnabled: boolean
  component: React.ComponentType<any>
  order: number
  excludedChain?: number[]
}

const MAINNET_CHAIN_ID = 8118
const STAGENET_CHAIN_ID = 8082

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'connect-wallet',
    title: 'Connect your wallet',
    description: 'Connect your wallet and switch to Shardeum Network.',
    isEnabled: true,
    component: WalletConnectStep,
    order: 1,
    excludedChain: [],
  },
  {
    id: 'claim-tokens',
    title: 'Claim testnet tokens from faucet',
    description: 'Claim SHM tokens from Shardeum faucet as a reward.',
    isEnabled: true,
    component: ClaimTokensStep,
    order: 2,
    excludedChain: [MAINNET_CHAIN_ID, STAGENET_CHAIN_ID],
  },
  {
    id: 'start-node',
    title: 'Start your node',
    description: 'Start your node to be a part of the validation network.',
    isEnabled: true,
    component: StartNodeStep,
    order: 3,
    excludedChain: [],
  },
  {
    id: 'stake',
    title: 'Stake your SHM',
    description: 'Stake SHM to become a validator & earn rewards.',
    isEnabled: true,
    component: StakeStep,
    order: 4,
    excludedChain: [],
  },
]

const Onboarding = () => {
  const [isNodeStarted, setIsNodeStarted] = useState(false)
  const [accountBalance, setAccountBalance] = useState('')
  const [chainId, setChainId] = useState(0)
  const [tokenClaimPhase, setTokenClaimPhase] = useState(0) // 0: hasn't claimed yet, 1: initiated request, 2: has claimed
  const { isConnected, address } = useAccount({
    onConnect: async (args) => {
      if (args?.address) {
        const balance = await fetchBalance({
          address: args?.address,
          chainId: CHAIN_ID,
        })
        setAccountBalance(`${balance?.formatted} ${balance?.symbol}`)
      }
    },
    onDisconnect: () => {
      setAccountBalance('')
    },
  })
  const [isStakingComplete, setIsStakingComplete] = useState(localStorage.getItem(onboardingCompletedKey) === 'true')
  const [stakedAmount, setStakedAmount] = useState(0)
  const [showSuccessScreen, setShowSuccessScreen] = useState(false)
  const { setCurrentToast } = useToastStore((state: any) => ({
    setCurrentToast: state.setCurrentToast,
  }))

  useEffect(() => {
    const claimantAddress = localStorage.getItem(tokensClaimedByKey)
    setTokenClaimPhase(claimantAddress === address ? 2 : 0)
  }, [address])

  const { chain } = useNetwork()

  useEffect(() => {
    setChainId(chain?.id || 0)
  }, [chain?.id])

  const { switchNetwork } = useSwitchNetwork()
  const router = useRouter()
  const { isMobile } = useDevice()
  const { disconnect } = useDisconnect()
  const { nodeStatus, isLoading, startNode } = useNodeStatus()
  const minimumStakeRequirement = useMemo(() => {
    return Math.max(parseFloat(nodeStatus?.stakeRequirement || '10') - parseFloat(nodeStatus?.lockedStake || '0'), 0)
  }, [nodeStatus?.stakeRequirement, nodeStatus?.lockedStake])

  const {
    sendTransaction,
    handleStakeChange,
    setNomineeAddress,
    isEmpty,
    isLoading: isStaking,
  } = useStake({
    nominator: address?.toString() || '',
    nominee: nodeStatus?.nomineeAddress || '',
    stakeAmount: minimumStakeRequirement.toString(),
    totalStaked: nodeStatus?.lockedStake ? Number(nodeStatus?.lockedStake) : 0,
    onStake: (wasTxnSuccessful: boolean) => {
      setIsStakingComplete(wasTxnSuccessful)
    },
  })

  useEffect(() => {
    if (nodeStatus?.state && nodeStatus.state !== 'stopped') {
      setIsNodeStarted(true)
    } else {
      setIsNodeStarted(false)
    }
  }, [nodeStatus?.state])

  useEffect(() => {
    const nomineeAddress = nodeStatus?.nomineeAddress
    if (nomineeAddress) {
      setNomineeAddress(nomineeAddress)
    }
  }, [nodeStatus?.nomineeAddress, setNomineeAddress])

  useEffect(() => {
    if (isStakingComplete) {
      localStorage.setItem(onboardingCompletedKey, 'true')
      setCurrentToast({
        severity: ToastSeverity.SUCCESS,
        title: 'Stake Added',
        description: `${stakedAmount.toFixed(2)} SHM staked Successfully`,
        followupNotification: {
          title: 'Stake Added',
          type: NotificationType.REWARD,
          severity: NotificationSeverity.SUCCESS,
        },
      })
      const delay = setTimeout(() => {
        setShowSuccessScreen(true)
      }, 3000)

      return () => clearTimeout(delay)
    }
  }, [isStakingComplete])

  useEffect(() => {
    if (isStaking) {
      setCurrentToast({
        severity: ToastSeverity.LOADING,
        title: 'Processing Adding Stake',
        description: 'Your add stake transaction is in process.',
        duration: 300000, // 300 seconds
      })
    }
  }, [isStaking])

  const filteredSteps = useMemo(() => {
    return ONBOARDING_STEPS.filter((step) => step.isEnabled && !step.excludedChain?.includes(chainId)).sort(
      (a, b) => a.order - b.order
    )
  }, [chainId])

  return (
    <div
      className={'h-full w-full flex justify-between text-black fill-bg py-24 ' + GeistSans.className}
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
                <span className="font-semibold text-3xl w-full">Welcome to Shardeum Validator Setup</span>
                <div className="flex flex-col gap-y-3 mt-6">
                  {filteredSteps.map((step, index) => (
                    <div key={step.id} className="flex gap-x-1 items-center">
                      <CheckCircleIcon className="h-5 w-5" />
                      <span className="text-sm">{step.description}</span>
                    </div>
                  ))}
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
                      <Link className="flex items-center" href={VALIDATOR_GUI_DOCS_URL} target="_blank">
                        <span className="ml-2 underline">Documentation</span>
                        <ArrowUpRightIcon className="h-5 ml-1" />
                      </Link>
                    </div>
                    <div className="flex items-center ml-4">
                      <QuestionMarkCircleIcon className="w-5 h-5" />
                      <Link className="flex items-center" href={VALIDATOR_GUI_FAQS_URL} target="_blank">
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
                  return
                }}
                disableActions={true}
              />
            </div>
            <div className="w-full max-w-xl flex flex-col items-start gap-y-3">
              {filteredSteps.map((step, index) => {
                const StepComponent = step.component
                return <StepComponent key={step.id} stepNumber={index + 1} />
              })}

              {/* Skip all */}
              <div className="flex w-full justify-end my-2">
                <button
                  className="text-xs font-semibold"
                  onClick={() => {
                    router.push('/dashboard')
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
                router.push('/dashboard')
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
  )
}

Onboarding.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Shardeum Dashboard</title>
        <meta name="description" content="Dashboard to configure a Shardeum validator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <div className="h-screen w-screen flex center relative bg-[#FAFAFA]">{page}</div>
    </>
  )
}

export default Onboarding
