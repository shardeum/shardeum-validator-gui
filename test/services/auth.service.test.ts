import { authService, wasLoggedOutKey, isFirstTimeUserKey } from '../../services/auth.service'
import Router from 'next/router'

// Define the isLoggedInKey locally since it's not exported
const isLoggedInKey = 'isLoggedIn'

describe('Auth Service', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  describe('isLogged getter', () => {
    it('should return true when isLoggedIn key is set in localStorage', () => {
      localStorage.setItem(isLoggedInKey, 'true')
      expect(authService.isLogged).toBe(true)
    })

    it('should return false when isLoggedIn key is not set in localStorage', () => {
      expect(authService.isLogged).toBe(false)
    })
  })

  describe('logout', () => {
    it('should call the logout API endpoint and redirect to login page', async () => {
      // Mock successful API response
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
      })

      await authService.logout('http://localhost:8080')

      // Check if fetch was called with the correct parameters
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/auth/logout', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      // Check if localStorage was updated correctly
      expect(localStorage.getItem(isLoggedInKey)).toBeNull()
      expect(localStorage.getItem(wasLoggedOutKey)).toBe('true')

      // Check if router was called to redirect
      expect(Router.push).toHaveBeenCalledWith('/login')
    })

    it('should throw an error when the API call fails', async () => {
      // Mock failed API response
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 500,
      })

      await expect(authService.logout('http://localhost:8080')).rejects.toThrow('Error logging out!')
    })
  })

  // Additional tests can be added for login and other functions
})
