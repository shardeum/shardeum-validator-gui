import { hashSha256 } from '../../utils/sha256-hash'

// Mock the crypto.subtle API
const mockDigest = jest.fn()
Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      digest: mockDigest,
    },
  },
})

describe('sha256-hash', () => {
  beforeEach(() => {
    mockDigest.mockClear()
  })

  it('should hash a string using SHA-256', async () => {
    // Mock implementation for TextEncoder and crypto.subtle.digest
    const mockEncode = jest.fn().mockReturnValue(new Uint8Array([1, 2, 3]))
    global.TextEncoder = jest.fn().mockImplementation(() => ({
      encode: mockEncode,
    }))

    // Mock the digest result
    const mockArrayBuffer = new ArrayBuffer(32)
    const mockUint8Array = new Uint8Array(mockArrayBuffer)
    // Fill with some test values
    for (let i = 0; i < 32; i++) {
      mockUint8Array[i] = i
    }
    mockDigest.mockResolvedValue(mockArrayBuffer)

    const result = await hashSha256('test-password')

    // Check that TextEncoder was called with the password
    expect(mockEncode).toHaveBeenCalledWith('test-password')

    // Check that crypto.subtle.digest was called with the right parameters
    expect(mockDigest).toHaveBeenCalledWith('SHA-256', new Uint8Array([1, 2, 3]))

    // Expected hex string based on the mock Uint8Array values
    const expectedHex = '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f'
    expect(result).toBe(expectedHex)
  })
})
