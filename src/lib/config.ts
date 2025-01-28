// src/lib/config.ts

export const config = {
    alchemy: {
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    },
    etherscan: {
      apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
    }
  } as const;