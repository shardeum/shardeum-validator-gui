import { ConnectButton } from '@rainbow-me/rainbowkit'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

type WalletConnectButtonProps = {
  label: string
  toShowAddress?: boolean
  onConnect?: boolean
}

export const WalletConnectButton = ({ label, toShowAddress = false }: WalletConnectButtonProps) => {
  const buttonClassName = 'w-full px-3 py-2 text-sm max-w-md border rounded-md'
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, openChainModal, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className={'bg-primary text-white ' + buttonClassName}
                  >
                    {label || 'Connect Wallet'}
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className={'text-green-700 font-medium bg-white' + buttonClassName}
                  >
                    Switch network
                  </button>
                )
              }

              return (
                <>
                  {!toShowAddress && (
                    <button disabled={true} type="button" className={'text-green-700 font-medium ' + buttonClassName}>
                      Wallet Connected
                    </button>
                  )}
                  {toShowAddress && (
                    <button
                      className="flex gap-x-2 max-w-sm cursor-pointer rounded-full bg-gray-200 px-2 py-1 text-black text-sm"
                      onClick={openAccountModal}
                    >
                      <span className="h-4 w-4">
                        <Jazzicon diameter={20} seed={jsNumberForAddress(account.address)} />
                      </span>
                      <span className="font-semibold text-sm">{account.displayName}</span>
                    </button>
                  )}
                </>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
