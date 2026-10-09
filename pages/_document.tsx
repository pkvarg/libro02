import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="sk">
      <Head>
        <meta name="theme-color" content="#FAF7F2" />
        {/* Same mark as the sidebar logo: white book reader on the burgundy brand circle. */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
