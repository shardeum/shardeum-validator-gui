// Import Jest DOM extensions
import '@testing-library/jest-dom'

// Add jest to global scope for ESLint
/* global jest, beforeEach */

// Mock Next.js router
jest.mock('next/router', () => ({
  __esModule: true,
  default: {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    reload: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    beforePopState: jest.fn(() => null),
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }),
  },
}))

// Mock localStorage
class LocalStorageMock {
  constructor() {
    this.store = {}
  }

  clear() {
    this.store = {}
  }

  getItem(key) {
    return this.store[key] || null
  }

  setItem(key, value) {
    this.store[key] = String(value)
  }

  removeItem(key) {
    delete this.store[key]
  }
}

global.localStorage = new LocalStorageMock()

// Mock fetch API
global.fetch = jest.fn()
global.AbortSignal = {
  timeout: jest.fn(() => ({})),
}

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
})
