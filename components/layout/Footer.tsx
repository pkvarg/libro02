import React from 'react'
import Link from 'next/link'
import CookieConsent from 'react-cookie-consent'

const Footer = () => {
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
  return (
    <div className="text-[#6f6f6f] flex flex-col gap-2 items-center justify-center py-6">
      <CookieConsent
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
        onDecline={() => {
          incrementCount()
        }}
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
        onAccept={() => {
          incrementCount()
        }}
        contentStyle={{
          flex: '1',
          margin: '0',
        }}
      >
        {'Táto stránka používa len pre fungovanie webu nevyhnutné cookies.'}
      </CookieConsent>
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
