import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import CookieConsent, { getCookieConsentValue } from 'react-cookie-consent'

const UMAMI_ID = '2ad99828-4e2f-4bcd-acbc-ed2e0ce40322'

const loadUmamiScript = () => {
  if (document.querySelector(`script[data-website-id="${UMAMI_ID}"]`)) return
  const script = document.createElement('script')
  script.defer = true
  script.src = 'https://analytics.pictusweb.com/script.js'
  script.setAttribute('data-website-id', UMAMI_ID)
  document.head.appendChild(script)
}

const Footer = () => {
  const [bannerVisible, setBannerVisible] = useState<'byCookieValue' | 'show' | 'hidden'>('byCookieValue')
  const apiUrl = 'https://hono-api.pictusweb.com/api/visitors/librosophia/increase'
  //const apiUrl = 'http://localhost:3013/api/visitors/librosophia/increase'

  const incrementCount = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to increment count')
      }
    } catch (err) {
      console.log(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  // Consent given on an earlier visit: load analytics on every page load.
  useEffect(() => {
    if (getCookieConsentValue() === 'true') {
      loadUmamiScript()
    }
  }, [])

  // Umami honours `umami.disabled`, so withdrawing consent stops tracking at once.
  const decide = (granted: boolean) => {
    try {
      if (granted) {
        localStorage.removeItem('umami.disabled')
      } else {
        localStorage.setItem('umami.disabled', '1')
      }
    } catch {
      // storage unavailable — the banner simply shows again next visit
    }
    if (granted) {
      loadUmamiScript()
    }
    if (bannerVisible === 'byCookieValue') {
      incrementCount()
    }
    setBannerVisible('hidden')
  }
  return (
    <footer className="mt-10 flex flex-col items-center justify-center gap-2 border-t border-line py-8 text-ink-muted">
      <CookieConsent
        visible={bannerVisible}
        location="bottom"
        style={{
          background: '#292524',
          color: '#FAF7F2',
          fontSize: '14px',
          lineHeight: '1.5',
          textAlign: 'start',
          alignItems: 'center',
          boxShadow: '0 -8px 30px rgba(41, 37, 36, 0.2)',
          padding: '12px 16px',
          zIndex: 45,
        }}
        buttonStyle={{
          background: '#FAF7F2',
          color: '#292524',
          fontSize: '14px',
          fontWeight: 600,
          padding: '10px 20px',
          borderRadius: '999px',
          border: '1px solid #FAF7F2',
          cursor: 'pointer',
          margin: '6px',
        }}
        buttonText={'Súhlasím'}
        expires={365}
        enableDeclineButton
        onDecline={() => decide(false)}
        declineButtonStyle={{
          background: 'transparent',
          color: '#FAF7F2',
          fontSize: '14px',
          fontWeight: 600,
          padding: '10px 20px',
          borderRadius: '999px',
          border: '1px solid rgba(250, 247, 242, 0.4)',
          cursor: 'pointer',
          margin: '6px',
        }}
        declineButtonText={'Nesúhlasím'}
        onAccept={() => decide(true)}
        contentStyle={{
          flex: '1 1 300px',
          margin: '6px',
        }}
      >
        So súhlasom meriame návštevnosť nástrojom Umami – bez cookies a bez ukladania IP adresy. Web
        funguje aj bez súhlasu.{' '}
        <Link href="/privacy#cookies" className="underline">
          Viac informácií
        </Link>
      </CookieConsent>
      <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm">
        <Link href="/rules" className="focus-ring rounded hover:text-ink hover:underline">
          Pravidlá a podmienky
        </Link>
        <Link href="/privacy" className="focus-ring rounded hover:text-ink hover:underline">
          Ochrana osobných údajov
        </Link>
        <button
          type="button"
          onClick={() => setBannerVisible('show')}
          className="focus-ring rounded hover:text-ink hover:underline"
        >
          Nastavenia cookies
        </button>
        <a href="mailto:info@librosophia.sk" className="focus-ring rounded hover:text-ink hover:underline">
          info@librosophia.sk
        </a>
      </nav>
      <Link className="text-sm hover:text-ink" href={'https://cestazivota.sk'} target="_blank">
        &copy; {Date().substring(11, 15)} cestazivota.sk
      </Link>
      <Link className="text-xs hover:text-ink" href="https://pictusweb.sk" target="_blank">
        &#60;&#47;&#62; PICTUSWEB development
      </Link>
    </footer>
  )
}

export default Footer
