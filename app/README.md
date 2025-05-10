# EventSeal: Blockchain-Verified Event Ticketing

EventSeal is a decentralized application (dApp) that allows event organizers to create events, manage registrations, and distribute blockchain-verified attendance NFTs to participants. Built on Solana for fast and low-cost transactions.

## Features

- **Create Events**: Host events with all the details including NFT rewards for attendees
- **Registration Management**: Keep track of who has registered for your events
- **Attendance Verification**: Easily confirm attendance at your events
- **NFT Minting**: Automatically mint unique proof-of-attendance NFTs for verified attendees
- **NFT Gallery**: Users can view their collected NFTs in their profile

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Blockchain**: Solana (Web3.js, Wallet Adapter)
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: IPFS (via Lighthouse)

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Solana wallet with devnet SOL for NFT minting

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/eventseal.git
cd eventseal/app
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up your environment variables

Create a `.env.local` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/eventseal"

# Solana
SOLANA_NETWORK="devnet"
MINTER_PRIVATE_KEY="your_solana_wallet_private_key_for_minting"

# Lighthouse (IPFS)
LIGHTHOUSE_API_KEY="your_lighthouse_api_key"
```

### 4. Set up the database

```bash
npx prisma migrate dev
```

This will create the necessary tables in your PostgreSQL database.

### 5. Funding your minting wallet

For NFT minting to work, you need a funded Solana wallet:

1. Export your private key from a wallet like Phantom or Solflare
2. Add it to your `.env.local` file as `MINTER_PRIVATE_KEY`
3. Ensure this wallet has SOL on the devnet:
   - Visit [Solana Faucet](https://faucet.solana.com/)
   - Request devnet SOL to your wallet address

### 6. Run the development server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Usage Flow

1. **Create an Event**:
   - Connect your wallet
   - Fill in event details and upload an image for the NFT
   - Submit to create the event

2. **Manage Registrations**:
   - Share your event page with participants
   - View who has registered in your dashboard

3. **Confirm Attendance**:
   - In the event dashboard, confirm attendees who were present
   - This mints an NFT directly to their wallet

4. **View NFTs**:
   - Users can view their NFT collection in their profile

## Solana Integration

This application interacts with Solana to:
- Mint unique NFTs for event attendees
- Store transaction signatures for verification
- Provide on-chain proof of attendance

The minting process uses your configured wallet (MINTER_PRIVATE_KEY) to pay for transaction fees.

## Troubleshooting

- **NFTs not appearing in profile**: Click the "Refresh NFTs" button on the profile page
- **Minting errors**: Ensure your minting wallet has enough SOL
- **Database connection issues**: Double-check your DATABASE_URL and PostgreSQL setup

## Development Notes

- All NFT minting operations happen server-side through API routes
- Images are stored on IPFS via Lighthouse
- The Prisma schema defines the database structure

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
