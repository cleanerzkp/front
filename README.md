# DeFi Wallet Interface Take-Home Assignment

A Web3 wallet interface that enables users to connect their wallet, wrap ETH into WETH, and swap WETH for ERC20 tokens using Uniswap V2, with a focus on accurate gas calculations and user experience.

## Local Setup

1. Clone the repository:
```bash
git clone https://github.com/cleanerzkp/front.git
cd front
```

2. Install dependencies:
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

3. Create a `.env` file in the root directory with your API keys:
```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key
```

4. Start the development server:
```bash
# Using npm
npm run dev


5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Development Assumptions

1. **Wallet Support**
   - Primary focus on MetaMask integration
   - Users have MetaMask installed and are familiar with basic wallet operations
   - Ethereum Mainnet is the target network

2. **Gas Calculations**
   - 20% safety buffer added to gas estimates
   - Gas prices fetched from Alchemy API
   - Conservative gas limit estimates for different operations

3. **Token Operations**
   - WETH contract address is fixed to Mainnet
   - 5% slippage tolerance for swaps
   - DAI as the primary ERC20 token for swaps

4. **Transaction History**
   - Limited to last 3 transactions
   - Mock data used when no transactions are available
   - Etherscan API used for transaction verification

## Areas for Improvement

Given more time, the following improvements could be implemented:

   - Support for multiple wallet providers
   - Network switching capabilities
   - Better wallet error handling
   - Would have just used walletconnect but wanted to meet the requirements 
   - Custom token support
   - Multiple token pair swaps
   - Advanced slippage controls
   - Comprehensive test coverage
   - Better state management
