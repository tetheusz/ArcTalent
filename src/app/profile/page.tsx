'use client'

import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ConnectKitButton } from 'connectkit'

export default function ProfileRedirect() {
  const { address, isConnected } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (isConnected && address) {
      router.push(`/profile/${address}`)
    }
  }, [isConnected, address, router])

  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '2rem'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '0.1em' }}>MANIFEST YOUR IDENTITY</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '400px', textAlign: 'center' }}>
        Connect your wallet to access your Archetype profile and track your on-chain reputation.
      </p>
      <ConnectKitButton />
    </div>
  )
}
