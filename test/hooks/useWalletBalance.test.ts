import { renderHook, act } from '@testing-library/react'
import { useWalletBalance } from '../../hooks/useWalletBalance'

// Mock window.ethereum
const mockEthereum = {
  request: jest.fn(),
}

// Mock balance value
const MOCK_BALANCE_VALUE = '5000000000000000000' // 5 ETH in wei
const ZERO_BALANCE = '0' // Zero balance

// Mock ethers provider
const mockGetBalance = jest.fn()
jest.mock('ethers', () => {
  return {
    ethers: {
      providers: {
        Web3Provider: jest.fn().mockImplementation(() => ({
          getBalance: mockGetBalance,
        })),
      },
      utils: {
        formatEther: jest.fn((value) => {
          if (value === ZERO_BALANCE) return '0'
          return '5'
        }),
        parseEther: jest.fn(() => MOCK_BALANCE_VALUE),
      },
    },
  }
})

describe('useWalletBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset window.ethereum for each test
    Object.defineProperty(window, 'ethereum', {
      value: mockEthereum,
      writable: true,
    })
  })

  it('fetches wallet balance successfully', async () => {
    // Mock getBalance to return a successful value
    mockGetBalance.mockResolvedValueOnce(MOCK_BALANCE_VALUE)

    const { result } = renderHook(({ address, fallbackData }) => useWalletBalance(address, fallbackData), {
      initialProps: {
        address: '0xmockAddress',
        fallbackData: null,
      },
    })

    // Initially, balanceData should be null
    expect(result.current.balanceData).toBeNull()

    // Wait for the async effect to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    // After the effect, balanceData should be populated
    expect(result.current.balanceData).toEqual({
      formatted: '5',
      symbol: 'SHM',
    })

    // Check if getBalance was called with the correct address
    expect(mockGetBalance).toHaveBeenCalledWith('0xmockAddress')
  })

  it('falls back to provided data if wallet fetch fails', async () => {
    // Mock getBalance to throw an error
    mockGetBalance.mockRejectedValueOnce(new Error('Mock Error'))

    const fallbackData = { formatted: '10', symbol: 'SHM' }

    const { result } = renderHook(({ address, fallbackData }) => useWalletBalance(address, fallbackData), {
      initialProps: {
        address: '0xmockAddress',
        fallbackData,
      },
    })

    // Initially, balanceData should be null
    expect(result.current.balanceData).toBeNull()

    // Wait for the async effect to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    // After the error, balanceData should be set to fallbackData
    expect(result.current.balanceData).toEqual(fallbackData)
  })

  it('should not try to fetch balance if address is undefined', async () => {
    const { result } = renderHook(({ address, fallbackData }) => useWalletBalance(address, fallbackData), {
      initialProps: {
        address: undefined,
        fallbackData: null,
      },
    })

    // Wait for any potential async operations
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    // balanceData should remain null
    expect(result.current.balanceData).toBeNull()
    // getBalance should not be called
    expect(mockGetBalance).not.toHaveBeenCalled()
  })

  it('should not try to fetch balance if window.ethereum is undefined', async () => {
    // Set window.ethereum to undefined
    Object.defineProperty(window, 'ethereum', {
      value: undefined,
      writable: true,
    })

    const { result } = renderHook(({ address, fallbackData }) => useWalletBalance(address, fallbackData), {
      initialProps: {
        address: '0xmockAddress',
        fallbackData: null,
      },
    })

    // Wait for any potential async operations
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    // balanceData should remain null
    expect(result.current.balanceData).toBeNull()
    // getBalance should not be called
    expect(mockGetBalance).not.toHaveBeenCalled()
  })

  it('handles zero balance correctly', async () => {
    // Mock getBalance to return zero
    mockGetBalance.mockResolvedValueOnce(ZERO_BALANCE)

    const { result } = renderHook(({ address, fallbackData }) => useWalletBalance(address, fallbackData), {
      initialProps: {
        address: '0xmockAddress',
        fallbackData: null,
      },
    })

    // Wait for the async effect to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    // After the effect, balanceData should show zero balance
    expect(result.current.balanceData).toEqual({
      formatted: '0',
      symbol: 'SHM',
    })
  })

  it('updates balance when address changes', async () => {
    // First render with initial address
    mockGetBalance.mockResolvedValueOnce(MOCK_BALANCE_VALUE)

    const { result, rerender } = renderHook(({ address, fallbackData }) => useWalletBalance(address, fallbackData), {
      initialProps: {
        address: '0xmockAddress1',
        fallbackData: null,
      },
    })

    // Wait for the first fetch
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.balanceData).toEqual({
      formatted: '5',
      symbol: 'SHM',
    })
    expect(mockGetBalance).toHaveBeenCalledWith('0xmockAddress1')

    // Set up mock for second address
    mockGetBalance.mockClear()
    mockGetBalance.mockResolvedValueOnce(MOCK_BALANCE_VALUE)

    // Rerender with new address
    rerender({
      address: '0xmockAddress2',
      fallbackData: null,
    })

    // Wait for the second fetch
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    // Should have fetched balance for the new address
    expect(mockGetBalance).toHaveBeenCalledWith('0xmockAddress2')
  })

  it('prefers wallet balance over fallback data when available', async () => {
    // Mock getBalance to return a successful value
    mockGetBalance.mockResolvedValueOnce(MOCK_BALANCE_VALUE)

    const fallbackData = { formatted: '10', symbol: 'SHM' }

    const { result } = renderHook(({ address, fallbackData }) => useWalletBalance(address, fallbackData), {
      initialProps: {
        address: '0xmockAddress',
        fallbackData,
      },
    })

    // Wait for the async effect to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    // Should use wallet balance (5) instead of fallback (10)
    expect(result.current.balanceData).toEqual({
      formatted: '5',
      symbol: 'SHM',
    })
  })
})
