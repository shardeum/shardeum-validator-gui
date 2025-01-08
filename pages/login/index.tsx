import { ReactElement, useContext } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { GeistSans } from "geist/font";
import { authService } from "../../services/auth.service";
import Head from "next/head";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import loginAsideBg from "../../assets/login-aside-bg.svg";
import mobileLoginBg from "../../assets/mobile-login-bg.svg";
import { Logo } from "../../components/atoms/Logo";
import { Title } from "../../components/atoms/Title";
import { LoginForm } from "../../components/molecules/LoginForm";
import { onboardingCompletedKey } from "../onboarding";
import { useNodeVersion } from "../../hooks/useNodeVersion";
import { useDevice } from "../../context/device";

const Login = () => {
  const router = useRouter();
  const { isMobile } = useDevice();

  // redirect to home if already logged in
  if (authService.isLogged) {
    const onboardingCompleted =
      localStorage.getItem(onboardingCompletedKey) === "true";
    if (onboardingCompleted) {
      router.replace("/onboarding");
    } else {
      router.replace("/dashboard");
    }
  }

  const { version } = useNodeVersion(true);

  return (
    <div className="flex flex-col h-screen justify-between relative">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <div className="w-screen flex center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <aside
          className="basis-0 grow max-sm:hidden w-full h-screen bg-[#3042FB] text-white flex flex-col justify-end items-start fill-bg"
          style={{
            backgroundImage: `url(${loginAsideBg.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "fill",
          }}
        >
          <div className="flex flex-col items-center mb-20 ml-20 gap-y-8">
            <span
              className={
                "break-normal max-w-sm font-medium text-xl " +
                GeistSans.className
              }
            >
              Your node operation is key to Shardeum&apos;s success—thank you!
            </span>
            <div className="flex justify-start ml-3">
              <div className="max-w-[200px] break-normal flex flex-col justify-start">
                <CheckCircleIcon className="h-5 w-5 mb-2" />
                <span>Keeps platform uptime consistently high </span>
              </div>
              <div className="max-w-[200px] break-normal flex flex-col justify-start">
                <CheckCircleIcon className="h-5 w-5 mb-2" />
                <span>Keeps the network truly decentralized</span>
              </div>
            </div>
          </div>
        </aside>
        <div className="flex basis-0 grow text-stone-500 rounded-xl text-sm h-full">
          <main className={`grow px-6 pt-24 md:p-20 h-full`}>
            <div className="flex flex-col gap-y-8 h-full">
              <Logo className="w-40 mb-4" />
              <Title
                text="Enter password to connect to the validator dashboard"
                className={
                  GeistSans.className +
                  " text-3xl font-semibold text-gray-900 max-w-[400px]"
                }
              />
              <div className="flex flex-col justify-between h-full">
                <LoginForm />
                {!isMobile && (
                  <div className="flex justify-between w-full">
                    <span>
                      Validator Version : {version?.runnningValidatorVersion}
                    </span>
                    <span>Running on Localhost</span>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      {isMobile && (
        <div
          className="fill-bg h-96 w-full"
          style={{
            backgroundImage: `url(${mobileLoginBg.src})`,
          }}
        ></div>
      )}
    </div>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Shardeum Dashboard</title>
        <meta
          name="description"
          content="Dashboard to configure a Shardeum validator"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-[$FAFAFA] h-screen">{page}</div>
    </>
  );
};

export default Login;