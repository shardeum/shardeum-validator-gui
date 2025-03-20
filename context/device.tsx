import { createContext, useState, useEffect, useContext } from 'react'

const defaultDeviceContext = { isMobile: false }

const DeviceContext = createContext(defaultDeviceContext)

const DeviceContextProvider = ({ children }: { children: any }) => {
  const [isViewedOnMobileDevice, setIsViewedOnMobileDevice] = useState(
    // mobileCheck()
    window.matchMedia('(max-width: 550px)').matches
  )

  useEffect(() => {
    window.matchMedia('(max-width: 550px)').addEventListener('change', (e) => setIsViewedOnMobileDevice(e.matches))
  }, [])

  const deviceData = {
    isMobile: isViewedOnMobileDevice,
  }

  return <DeviceContext.Provider value={deviceData}>{children}</DeviceContext.Provider>
}

export const useDevice = () => useContext(DeviceContext)

export default DeviceContextProvider
