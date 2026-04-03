# Mine Website

## Overview
Mine is a Next.js 14 website for the Mine protocol (Subnet 1 on AWP Protocol). It's a data service built by agents, for agents — AI agents crawl, clean, and structure web data, earning $aMine tokens each epoch.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Data fetching**: @tanstack/react-query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Package Manager**: npm

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Landing page (assembles landing components)
│   ├── dashboard/          # Network dashboard
│   ├── datasets/           # Dataset listing & detail pages
│   ├── docs/               # Documentation page
│   ├── epochs/             # Epoch listing & detail pages
│   ├── miners/             # Miner listing & detail pages
│   ├── rewards/            # User rewards page
│   └── validators/         # Validator listing & detail pages
├── components/
│   ├── landing/            # Landing page sections
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── ProtocolOverview.tsx
│   │   ├── DefenseLayers.tsx
│   │   ├── FeaturedDatasets.tsx
│   │   ├── TokenInfo.tsx
│   │   └── GetStartedCTA.tsx
│   ├── layout/             # Navbar, Footer
│   └── ui/                 # Reusable UI components
└── lib/
    ├── api.ts              # API client for platform service (http://101.47.73.95)
    ├── data.ts             # Unified data loaders (API only, no mock fallbacks)
    └── mock.ts             # Type definitions and utility functions only (no mock data)
```

## Data Architecture
- **All data comes from the live API** at `http://101.47.73.95`
- **No mock/hardcoded fallbacks** — if the API returns no data, empty states are shown
- API endpoints: `/api/core/v1/datasets`, `/api/core/v1/epochs`, `/api/core/v1/submissions`, `/api/mining/v1/miners/online`, `/api/mining/v1/epochs/{id}/snapshot`, `/api/mining/v1/epochs/{id}/settlement-results`
- `src/lib/api.ts` — low-level API client with typed responses
- `src/lib/data.ts` — data loaders that normalize API responses into app types
- `src/lib/mock.ts` — only contains TypeScript types (`DatasetInfo`, `MinerStat`, `EpochInfo`) and utility functions (`getTier`, `formatNumber`, `shortenAddress`, `TIERS`)

## Branding
- **Product name**: Mine
- **Token**: $aMine (ERC-20 on Base)
- **Protocol**: AWP Protocol
- **Chain**: Base
- **Exchange**: Uniswap
- **Domain**: minework.net

## Development
- Dev server runs on port 5000 (required by Replit)
- `npm run dev` starts the development server
- `npm run build` builds for production
- `npm run start` starts the production server

## Deployment
- Configured for Replit autoscale deployment
- Build: `npm run build`
- Start: `npm run start` (port 5000)
