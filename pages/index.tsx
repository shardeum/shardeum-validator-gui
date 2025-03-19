import { useRouter } from 'next/router'
import Head from 'next/head'
import { ReactElement, useEffect } from 'react'

function Overview() {
  const router = useRouter()

  useEffect(() => {
    router.push('/dashboard')
  }, [router])
}

Overview.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Shardeum Dashboard</title>
        <meta name="description" content="Dashboard to configure a Shardeum validator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <div className="h-screen w-screen flex center relative bg-[#FAFAFA]">{page}</div>
    </>
  )
}

export default Overview
