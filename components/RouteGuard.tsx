import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { authService, checkServerAuth } from "../services/auth.service";
import { useGlobals } from "../utils/globals";

export default function RouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const { apiBase } = useGlobals();

  useEffect(() => {
    // on initial load - run auth check
    initialAuthCheck();

    // on route change start - hide page content by setting authorized to null
    const hideContent = () => setAuthorized(null);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run client-side auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initialAuthCheck() {
    const isServerAuth = await checkServerAuth();
    authCheck(router.asPath);
  }

  function authCheck(url: string) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ["/login"];
    const path = url.split("?")[0];
    if (!authService.isLogged && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: "/login",
        query: { returnUrl: router.asPath },
      });
    } else {
      setAuthorized(true);
    }
  }

  return (
    <div>
      {authorized && children}
      {!authorized && <></>}
    </div>
  );
}