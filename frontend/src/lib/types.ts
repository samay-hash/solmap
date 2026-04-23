// ═══ Chaos World Types ═══

export interface WorldState {
  chaosLevel: number;         // 0-100
  totalTransactions: number;
  lastEventTimestamp: number;
  factionCount: number;
  factions: Faction[];
  territories: Territory[];
  events: ChaosEvent[];
}

export interface Faction {
  id: number;
  name: string;
  color: string;
  power: number;
  memberCount: number;
  territoryCount: number;
  treasury: number;
}

export interface Territory {
  zoneId: number;
  ownerFactionId: number;
  defensePower: number;
  lastContested: number;
  x: number;
  y: number;
  label: string;
}

export interface Player {
  wallet: string;
  factionId: number;
  power: number;
  joinTimestamp: number;
  totalTrades: number;
}

export type ChaosEventType = 'war' | 'betrayal' | 'airdrop' | 'trade' | 'attack' | 'capture' | 'join';

export interface ChaosEvent {
  id: string;
  type: ChaosEventType;
  message: string;
  timestamp: number;
  factionId?: number;
  targetFactionId?: number;
  impact?: number;
}

export interface WSMessage {
  event: string;
  data: unknown;
}

// Faction presets
export const FACTIONS: Faction[] = [
  { id: 1, name: 'Crimson Order', color: '#ef4444', power: 100, memberCount: 0, territoryCount: 0, treasury: 0 },
  { id: 2, name: 'Azure Legion', color: '#3b82f6', power: 100, memberCount: 0, territoryCount: 0, treasury: 0 },
  { id: 3, name: 'Emerald Pact', color: '#10b981', power: 100, memberCount: 0, territoryCount: 0, treasury: 0 },
];

// Territory presets
export const TERRITORIES: Territory[] = [
  { zoneId: 1, ownerFactionId: 1, defensePower: 50, lastContested: 0, x: 200, y: 150, label: 'Crimson Citadel' },
  { zoneId: 2, ownerFactionId: 2, defensePower: 50, lastContested: 0, x: 500, y: 120, label: 'Azure Fortress' },
  { zoneId: 3, ownerFactionId: 0, defensePower: 20, lastContested: 0, x: 350, y: 280, label: 'The Nexus' },
  { zoneId: 4, ownerFactionId: 3, defensePower: 50, lastContested: 0, x: 180, y: 380, label: 'Emerald Grove' },
  { zoneId: 5, ownerFactionId: 0, defensePower: 10, lastContested: 0, x: 520, y: 350, label: 'Shadow Wastes' },
  { zoneId: 6, ownerFactionId: 0, defensePower: 15, lastContested: 0, x: 350, y: 450, label: 'Lost Ruins' },
  { zoneId: 7, ownerFactionId: 0, defensePower: 5, lastContested: 0, x: 650, y: 250, label: 'Void Gate' },
];
