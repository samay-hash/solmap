# 🌀 CHAOS WORLD

> **A living blockchain world where every transaction shapes reality — built on Solana**

## 🧨 What is Chaos World?

Chaos World is a real-time, on-chain strategy game where:
- **3 factions** compete for territory control
- **Every transaction** (trade, attack, join) changes the world state
- A **Chaos Engine** triggers unpredictable events (wars, betrayals, power surges)
- **AI agents** play alongside humans, creating a truly living world

## 🏗️ Architecture

```
solhack/
├── programs/        → Solana smart contracts (Anchor/Rust)
├── backend/         → WebSocket server + AI bots (Node.js)
└── frontend/        → Visual world interface (Next.js)
```

## ⚡ Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend (AI Bots + WebSocket)
```bash
cd backend
npm install
npm run dev
```

### On-Chain (Solana/Anchor)
```bash
cd programs
anchor build
anchor deploy --provider.cluster devnet
```

## 🎮 How It Works

1. **Connect wallet** → Join a faction
2. **Trade** → Buy power for your faction (chaos increases)
3. **Attack territories** → Capture zones from other factions
4. **Chaos events** → Wars, betrayals, and power surges trigger automatically
5. **AI agents** → Bots trade and attack in the background

## 🧠 Chaos Engine

Every action has a chance to trigger a world event:
- **WAR** (chaos > 80): Strongest faction auto-attacks weakest
- **BETRAYAL** (chaos > 50): Internal sabotage reduces faction power
- **AIRDROP** (random): Lucky faction gets a power boost

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| On-Chain | Anchor (Rust) on Solana |
| Frontend | Next.js + Framer Motion |
| Backend | Express + WebSocket |
| Wallet | @solana/wallet-adapter |

## 📝 License

MIT — Built for Solana Hackathon 🚀
