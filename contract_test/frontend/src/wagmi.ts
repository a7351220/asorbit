import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { mainnet, sepolia, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [mainnet, sepolia, baseSepolia],
    connectors: [
      injected(),
      coinbaseWallet(),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [baseSepolia.id]: http(),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
