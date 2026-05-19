'use client'

import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { syncUser } from '@/actions/users'

export default function AuthSync() {
  const { address, isConnected } = useAccount()

  useEffect(() => {
    if (isConnected && address) {
      syncUser(address)
    }
  }, [isConnected, address])

  return null
}
