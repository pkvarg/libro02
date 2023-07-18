import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import { Link } from '@react-email/link'
import * as React from 'react'

const main = {
  backgroundColor: '#ffffff',
}

const container = {
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto',
}

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
}

const link = {
  color: '#2754C5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  textDecoration: 'underline',
}

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
}

const footer = {
  color: '#898989',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px',
}

const code = {
  display: 'inline-block',
  padding: '16px 4.5%',
  width: '90.5%',
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  border: '1px solid #eee',
  color: '#333',
}

export const emailRegister = (name: string) => (
  <Html>
    <Head />
    {/* <Preview>Log in with this magic link</Preview> */}
    <Body style={main}>
      <Container style={container}>
        {!name.includes('http') ? (
          <>
            <Heading style={h1}>Vitaj na Librosophii {name}</Heading>
            <Text style={{ ...text, marginBottom: '14px' }}>
              Registrácia bola úspešná
            </Text>
          </>
        ) : (
          <>
            <Heading style={h1}>Registračný link</Heading>
            <Text style={{ ...text, marginBottom: '14px' }}>
              Kliknite na link pre dokončenie registrácie:
            </Text>
            <Link href={name} style={link}>
              Link
            </Link>
          </>
        )}

        <Text style={footer}>Vaša Librosophia</Text>
      </Container>
    </Body>
  </Html>
)

export default emailRegister
