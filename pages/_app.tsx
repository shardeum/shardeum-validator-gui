import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import React, { ReactElement, useEffect } from "react";
import { NextPage } from "next";
import ToastContextProvider from "../components/ToastContextProvider";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import ConfirmModalContextProvider from "../components/ConfirmModalContextProvider";
import RouteGuard from "../components/RouteGuard";
import FetcherContextProvider from "../components/FetcherContextProvider";
import DeviceContextProvider from "../context/device";
import { Modal } from "../components/layouts/Modal";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '../config/wagmiConfig';
export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactElement | null;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function getDefaultLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
}

// Prevents certain types of cross-origin attacks and iframe-based clickjacking
function preventWindowControl() {
  if (window.opener) {
    window.opener = null;
  }
  if (window.top && window.top !== window.self) {
    window.top.location = window.self.location;
  }
}

const queryClient = new QueryClient()

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? getDefaultLayout;

  useEffect(() => {
    preventWindowControl();
    window.addEventListener('focus', preventWindowControl);
    return () => {
      window.removeEventListener('focus', preventWindowControl);
    };
  }, []);

  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider modalSize="compact">
            <RouteGuard>
              <ConfirmModalContextProvider>
                <ToastContextProvider>
                  <DeviceContextProvider>
                    <FetcherContextProvider>
                      {getLayout(<Component {...pageProps} />)}
                    <Modal />
                    </FetcherContextProvider>
                  </DeviceContextProvider>
                </ToastContextProvider>
              </ConfirmModalContextProvider>
            </RouteGuard>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
