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
    <div className="text-[#6f6f6f] flex flex-col gap-2 items-center justify-center py-6">
      <CookieConsent
        visible={bannerVisible}
        location="bottom"
        style={{
          //background: 'rgba(2, 3, 16, 0.9)',
          background: '#08a6e9',
          backdropFilter: 'blur(10px)',
          color: '#ffffff',
          fontSize: '16px',
          textAlign: 'start',
          borderTop: '1px solid rgba(247, 194, 36, 0.3)',
          boxShadow: '0 -5px 20px rgba(0, 0, 0, 0.3)',
          padding: '16px 24px',
        }}
        buttonStyle={{
          background: '#10e92d',
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: 'bold',
          padding: '10px 24px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        buttonText={'Súhlasím'}
        expires={365}
        enableDeclineButton
        onDecline={() => decide(false)}
        declineButtonStyle={{
          background: '#ff0000',
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: 'bold',
          padding: '8px 24px',
          borderRadius: '8px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginRight: '10px',
        }}
        declineButtonText={'Nesúhlasím'}
        onAccept={() => decide(true)}
        contentStyle={{
          flex: '1',
          margin: '0',
        }}
      >
        So súhlasom meriame návštevnosť nástrojom Umami – bez cookies a bez ukladania IP adresy. Web
        funguje aj bez súhlasu.{' '}
        <Link href="/privacy#cookies" className="underline">
          Viac informácií
        </Link>
      </CookieConsent>
      <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[14px]">
        <Link href="/rules" className="hover:text-white">
          Pravidlá a podmienky
        </Link>
        <Link href="/privacy" className="hover:text-white">
          Ochrana osobných údajov
        </Link>
        <button type="button" onClick={() => setBannerVisible('show')} className="hover:text-white">
          Nastavenia cookies
        </button>
        <a href="mailto:info@librosophia.sk" className="hover:text-white">
          info@librosophia.sk
        </a>
      </nav>
      <Link className="text-[15px]" href={'https://cestazivota.sk'} target="_blank">
        &copy; {Date().substring(11, 15)} cestazivota.sk
      </Link>
      <Link className="text-[12.5px]" href="https://pictusweb.sk" target="_blank">
        &#60;&#47;&#62; PICTUSWEB development
      </Link>
    </div>
  )
}

export default Footer
