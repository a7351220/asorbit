import { http, cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia, baseSepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

const walletConnectProjectId: string = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '330c035d80580970f3b5d53256331d89';
const alchemyId: string = process.env.NEXT_PUBLIC_ALCHEMY_ID || 'J6sPVZDl16QhXFbA79nlxZQfZRyDpV2R';

export function getConfig() {
  return getDefaultConfig({
    appName: 'AsOrbit',
    projectId: walletConnectProjectId,
    chains: [mainnet, sepolia, baseSepolia],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`),
      [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${alchemyId}`),
      [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${alchemyId}`),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
