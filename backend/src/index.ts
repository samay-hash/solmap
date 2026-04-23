// ═══ Chaos World — Backend Server ═══
// WebSocket server + AI Bot controller

import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3002;
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });

// Connected clients
const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`[WS] Client connected. Total: ${clients.size}`);

  // Send current world state on connect
  ws.send(JSON.stringify({
    event: 'world:update',
    data: worldState,
  }));

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WS] Client disconnected. Total: ${clients.size}`);
  });
});

// Broadcast to all clients
function broadcast(event: string, data: unknown) {
  const message = JSON.stringify({ event, data });
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// ═══ World State (in-memory, syncs with on-chain later) ═══
interface FactionState {
  id: number;
  name: string;
  color: string;
  power: number;
  memberCount: number;
  territoryCount: number;
}

interface WorldStateData {
  chaosLevel: number;
  totalTransactions: number;
  factions: FactionState[];
}

const worldState: WorldStateData = {
  chaosLevel: 12,
  totalTransactions: 0,
  factions: [
    { id: 1, name: 'Crimson Order', color: '#ef4444', power: 100, memberCount: 0, territoryCount: 0 },
    { id: 2, name: 'Azure Legion', color: '#3b82f6', power: 100, memberCount: 0, territoryCount: 0 },
    { id: 3, name: 'Emerald Pact', color: '#10b981', power: 100, memberCount: 0, territoryCount: 0 },
  ],
};

// ═══ AI Bot Agent ═══
const BOT_NAMES = ['Agent-Alpha', 'Agent-Beta', 'Agent-Gamma'];
const BOT_FACTIONS = [1, 2, 3];

const EVENT_TYPES = ['trade', 'join', 'attack'] as const;

function runBot() {
  const botIndex = Math.floor(Math.random() * BOT_NAMES.length);
  const botName = BOT_NAMES[botIndex];
  const factionId = BOT_FACTIONS[botIndex];
  const action = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];

  const faction = worldState.factions.find(f => f.id === factionId)!;

  switch (action) {
    case 'trade': {
      const amount = Math.floor(Math.random() * 5) + 1;
      faction.power += amount * 10;
      worldState.totalTransactions++;
      worldState.chaosLevel = Math.min(100, worldState.chaosLevel + 2);

      broadcast('chaos:event', {
        id: Math.random().toString(36).slice(2),
        type: 'trade',
        message: `🤖 ${botName} traded ${amount} SOL → ${faction.name} +${amount * 10} power`,
        timestamp: Date.now(),
        factionId,
      });
      break;
    }
    case 'join': {
      faction.memberCount++;
      faction.power += 5;
      worldState.chaosLevel = Math.min(100, worldState.chaosLevel + 1);

      broadcast('chaos:event', {
        id: Math.random().toString(36).slice(2),
        type: 'join',
        message: `🤖 ${botName} joined ${faction.name}! AI agents are taking sides...`,
        timestamp: Date.now(),
        factionId,
      });
      break;
    }
    case 'attack': {
      const targetFactionId = ((factionId % 3) + 1);
      const target = worldState.factions.find(f => f.id === targetFactionId)!;
      const success = faction.power > target.power * 0.8;

      if (success) {
        target.power = Math.max(0, target.power - 15);
        worldState.chaosLevel = Math.min(100, worldState.chaosLevel + 8);

        broadcast('chaos:event', {
          id: Math.random().toString(36).slice(2),
          type: 'war',
          message: `🤖⚔️ ${botName} (${faction.name}) attacked ${target.name}! -15 power!`,
          timestamp: Date.now(),
          factionId,
          targetFactionId,
        });
      } else {
        faction.power = Math.max(0, faction.power - 10);
        worldState.chaosLevel = Math.min(100, worldState.chaosLevel + 3);

        broadcast('chaos:event', {
          id: Math.random().toString(36).slice(2),
          type: 'attack',
          message: `🤖💥 ${botName} (${faction.name}) failed attack on ${target.name}!`,
          timestamp: Date.now(),
          factionId,
        });
      }
      break;
    }
  }

  // Chaos engine check
  if (worldState.chaosLevel > 75) {
    const roll = Math.random() * 100;
    if (roll < 20) {
      // Random chaos event
      const types = ['betrayal', 'airdrop'] as const;
      const chaosType = types[Math.floor(Math.random() * types.length)];
      const targetFaction = worldState.factions[Math.floor(Math.random() * 3)];

      if (chaosType === 'betrayal') {
        targetFaction.power = Math.max(0, targetFaction.power - 20);
        broadcast('chaos:event', {
          id: Math.random().toString(36).slice(2),
          type: 'betrayal',
          message: `🗡️ BETRAYAL! Internal sabotage cripples ${targetFaction.name}! -20 power!`,
          timestamp: Date.now(),
          factionId: targetFaction.id,
          impact: -20,
        });
      } else {
        targetFaction.power += 30;
        broadcast('chaos:event', {
          id: Math.random().toString(36).slice(2),
          type: 'airdrop',
          message: `✨ POWER SURGE! Ancient energy flows into ${targetFaction.name}! +30 power!`,
          timestamp: Date.now(),
          factionId: targetFaction.id,
          impact: 30,
        });
      }
    }
  }

  // Broadcast updated world state
  broadcast('world:update', worldState);

  console.log(`[BOT] ${botName} executed ${action} | Chaos: ${worldState.chaosLevel}`);
}

// Run bot every 15-30 seconds
function scheduleBotAction() {
  const delay = (Math.random() * 15000) + 15000; // 15-30s
  setTimeout(() => {
    runBot();
    scheduleBotAction();
  }, delay);
}

// API endpoint — health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    clients: clients.size,
    worldState: {
      chaosLevel: worldState.chaosLevel,
      transactions: worldState.totalTransactions,
    },
  });
});

// API endpoint — get world state
app.get('/api/world', (_req, res) => {
  res.json(worldState);
});

// Start server
server.listen(PORT, () => {
  console.log(`\n🌀 Chaos World Backend running on port ${PORT}`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
  console.log(`🤖 AI Bots: Starting...\n`);

  // Start bot after 5s delay
  setTimeout(() => {
    scheduleBotAction();
    console.log('[BOT] AI Agents activated! 🤖\n');
  }, 5000);
});
