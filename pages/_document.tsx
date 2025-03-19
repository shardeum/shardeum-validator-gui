import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html className="h-full bg-gray-50">
      <Head>
        <meta name="description" content="Dashboard to configure a Shardeum validator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-transparent h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
