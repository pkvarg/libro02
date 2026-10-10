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
        <meta name="description" content="Súkromná sociálna sieť na vzájomné požičiavanie kresťanských kníh." />
        {/* Link previews (Facebook, WhatsApp, Messenger, X...) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Librosophia" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:url" content="https://librosophia.sk" />
        <meta property="og:title" content="Librosophia" />
        <meta property="og:description" content="Súkromná sociálna sieť na vzájomné požičiavanie kresťanských kníh." />
        <meta property="og:image" content="https://librosophia.sk/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Librosophia – profil člena siete" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://librosophia.sk/og-image.jpg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
