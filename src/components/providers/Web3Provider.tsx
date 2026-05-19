'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'

const arcTestnet = {
  id: 5042002,
  name: 'Arc Network',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://5042002.rpc.thirdweb.com'] },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' },
  },
} as const

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [sepolia, arcTestnet],
    transports: {
      [sepolia.id]: http(),
      [arcTestnet.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

    // Required App Info
    appName: 'Archetypes',

    // Optional App Info
    appDescription: 'Archetype System for the Arc Ecosystem',
    appUrl: 'https://pulse.arc.io',
    appIcon: 'https://pulse.arc.io/logo.png',
  })
)

const queryClient = new QueryClient()

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider mode="dark">
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
