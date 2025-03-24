import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export interface BalanceData {
    formatted: string
    symbol: string
}

export const useWalletBalance = (
    address: string | undefined,
    fallbackData: { formatted: string; symbol: string } | null | undefined
) => {
    const [balanceData, setBalanceData] = useState<BalanceData | null>(null)

    useEffect(() => {
        const fetchWalletBalance = async () => {
            if (address && window.ethereum) {
                try {
                    // Use wallet provider to get balance from the active network
                    const provider = new ethers.providers.Web3Provider(window.ethereum)
                    const balance = await provider.getBalance(address)
                    setBalanceData({
                        formatted: ethers.utils.formatEther(balance),
                        symbol: 'SHM',
                    })
                } catch (error) {
                    console.error('Error fetching balance:', error)
                    // Fall back to provided fallback balance if custom fetch fails
                    if (fallbackData) {
                        setBalanceData({
                            formatted: fallbackData.formatted,
                            symbol: fallbackData.symbol,
                        })
                    }
                }
            }
        }

        fetchWalletBalance()
    }, [address, fallbackData])

    return { balanceData }
} 