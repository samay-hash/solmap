// ═══ Chaos World Constants ═══

import { PublicKey } from '@solana/web3.js';

// Solana network
export const NETWORK = 'devnet';
export const RPC_ENDPOINT = 'https://api.devnet.solana.com';

// Program IDs (will be updated after deploy)
export const CHAOS_PROGRAM_ID = new PublicKey('11111111111111111111111111111111');

// WebSocket
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

// Game constants
export const MAX_CHAOS_LEVEL = 100;
export const TRADE_COST_SOL = 0.01;
export const ATTACK_COST_POWER = 20;
export const CHAOS_PER_TRADE = 3;
export const CHAOS_PER_ATTACK = 10;
export const CHAOS_PER_JOIN = 2;

// Chaos thresholds
export const CHAOS_LOW = 30;
export const CHAOS_MEDIUM = 50;
export const CHAOS_HIGH = 75;
export const CHAOS_CRITICAL = 90;

// Faction colors map
export const FACTION_COLORS: Record<number, string> = {
  0: '#475569', // unclaimed
  1: '#ef4444', // Crimson Order
  2: '#3b82f6', // Azure Legion
  3: '#10b981', // Emerald Pact
};

export const FACTION_NAMES: Record<number, string> = {
  0: 'Unclaimed',
  1: 'Crimson Order',
  2: 'Azure Legion',
  3: 'Emerald Pact',
};
