'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  WorldState, ChaosEvent, Faction, Territory,
  FACTIONS, TERRITORIES, ChaosEventType
} from '@/lib/types';
import { WS_URL, CHAOS_PER_TRADE, CHAOS_PER_ATTACK, CHAOS_PER_JOIN, MAX_CHAOS_LEVEL } from '@/lib/constants';

const EVENT_MESSAGES: Record<ChaosEventType, string[]> = {
  war: [
    '⚔️ WAR! {faction} launched an assault on {target}!',
    '🔥 {faction} declares total war against {target}!',
    '💀 The armies of {faction} march on {target} territory!',
  ],
  betrayal: [
    '🗡️ BETRAYAL! A traitor within {faction} leaked battle plans!',
    '😈 Internal sabotage cripples {faction}\'s defenses!',
    '🎭 A spy from {target} infiltrated {faction}!',
  ],
  airdrop: [
    '🎁 POWER SURGE! {faction} received a mysterious power boost!',
    '✨ Ancient energy flows into {faction}\'s territory!',
    '💎 {faction} discovered hidden resources!',
  ],
  trade: [
    '💰 {faction} member traded power for {amount} SOL',
    '📈 Power shift: {faction} grows stronger',
  ],
  attack: [
    '⚡ {faction} attacks {zone}!',
    '🏴 {faction} launches strike on {zone}!',
  ],
  capture: [
    '🏰 {faction} captured {zone} from {target}!',
    '🚩 Territory seized! {zone} now belongs to {faction}!',
  ],
  join: [
    '🤝 A new warrior joins {faction}!',
    '⭐ {faction} grows — a champion has arrived!',
  ],
};

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function getRandomMessage(type: ChaosEventType, vars: Record<string, string>): string {
  const templates = EVENT_MESSAGES[type];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] || key);
}

const FACTION_NAMES_MAP: Record<number, string> = {
  0: 'Unclaimed', 1: 'Crimson Order', 2: 'Azure Legion', 3: 'Emerald Pact',
};

export function useWorldState() {
  const [world, setWorld] = useState<WorldState>({
    chaosLevel: 12,
    totalTransactions: 0,
    lastEventTimestamp: Date.now(),
    factionCount: 3,
    factions: FACTIONS.map(f => ({ ...f })),
    territories: TERRITORIES.map(t => ({ ...t })),
    events: [],
  });

  const [isShaking, setIsShaking] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket connection
  useEffect(() => {
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;
      ws.onmessage = (msg) => {
        try {
          const { event, data } = JSON.parse(msg.data);
          if (event === 'world:update') {
            setWorld(prev => ({ ...prev, ...data }));
          } else if (event === 'chaos:event') {
            addEvent(data as ChaosEvent);
          }
        } catch { /* ignore parse errors */ }
      };
      ws.onerror = () => { /* WebSocket not available, using local state */ };
      return () => ws.close();
    } catch {
      // WebSocket server not running, use local state
    }
  }, []);

  const triggerShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }, []);

  const addEvent = useCallback((event: ChaosEvent) => {
    setWorld(prev => ({
      ...prev,
      events: [event, ...prev.events].slice(0, 50),
    }));
  }, []);

  // Chaos engine check — deterministic based on state
  const chaosCheck = useCallback((currentChaos: number, txCount: number): ChaosEvent | null => {
    const seed = (Date.now() ^ txCount) % 100;

    if (currentChaos > 80 && seed < 25) {
      // WAR
      const aggressor = Math.floor(Math.random() * 3) + 1;
      const target = ((aggressor % 3) + 1);
      triggerShake();
      return {
        id: generateId(),
        type: 'war',
        message: getRandomMessage('war', {
          faction: FACTION_NAMES_MAP[aggressor],
          target: FACTION_NAMES_MAP[target],
        }),
        timestamp: Date.now(),
        factionId: aggressor,
        targetFactionId: target,
        impact: -20,
      };
    }

    if (currentChaos > 50 && seed < 12) {
      // BETRAYAL
      const victim = Math.floor(Math.random() * 3) + 1;
      return {
        id: generateId(),
        type: 'betrayal',
        message: getRandomMessage('betrayal', {
          faction: FACTION_NAMES_MAP[victim],
          target: FACTION_NAMES_MAP[((victim % 3) + 1)],
        }),
        timestamp: Date.now(),
        factionId: victim,
        impact: -15,
      };
    }

    if (seed < 8) {
      // AIRDROP
      const lucky = Math.floor(Math.random() * 3) + 1;
      return {
        id: generateId(),
        type: 'airdrop',
        message: getRandomMessage('airdrop', { faction: FACTION_NAMES_MAP[lucky] }),
        timestamp: Date.now(),
        factionId: lucky,
        impact: 25,
      };
    }

    return null;
  }, [triggerShake]);

  // Trade action
  const executeTrade = useCallback((factionId: number, amount: number) => {
    setWorld(prev => {
      const newChaos = Math.min(prev.chaosLevel + CHAOS_PER_TRADE, MAX_CHAOS_LEVEL);
      const newTx = prev.totalTransactions + 1;
      const newFactions = prev.factions.map(f =>
        f.id === factionId ? { ...f, power: f.power + amount * 10 } : f
      );

      const tradeEvent: ChaosEvent = {
        id: generateId(),
        type: 'trade',
        message: getRandomMessage('trade', {
          faction: FACTION_NAMES_MAP[factionId],
          amount: amount.toString(),
        }),
        timestamp: Date.now(),
        factionId,
      };

      const newState = {
        ...prev,
        chaosLevel: newChaos,
        totalTransactions: newTx,
        factions: newFactions,
        events: [tradeEvent, ...prev.events].slice(0, 50),
      };

      // Chaos check
      const chaosEvent = chaosCheck(newChaos, newTx);
      if (chaosEvent) {
        newState.chaosLevel = Math.min(newChaos + 5, MAX_CHAOS_LEVEL);
        newState.events = [chaosEvent, ...newState.events].slice(0, 50);

        // Apply chaos effect
        if (chaosEvent.type === 'war' && chaosEvent.targetFactionId) {
          newState.factions = newState.factions.map(f =>
            f.id === chaosEvent.targetFactionId ? { ...f, power: Math.max(0, f.power - 20) } : f
          );
        }
        if (chaosEvent.type === 'airdrop' && chaosEvent.factionId) {
          newState.factions = newState.factions.map(f =>
            f.id === chaosEvent.factionId ? { ...f, power: f.power + 25 } : f
          );
        }
        if (chaosEvent.type === 'betrayal' && chaosEvent.factionId) {
          newState.factions = newState.factions.map(f =>
            f.id === chaosEvent.factionId ? { ...f, power: Math.max(0, f.power - 15) } : f
          );
        }
      }

      return newState;
    });
  }, [chaosCheck]);

  // Attack territory
  const attackTerritory = useCallback((factionId: number, zoneId: number) => {
    setWorld(prev => {
      const territory = prev.territories.find(t => t.zoneId === zoneId);
      if (!territory) return prev;

      const attacker = prev.factions.find(f => f.id === factionId);
      if (!attacker || attacker.power < 20) return prev;

      const newChaos = Math.min(prev.chaosLevel + CHAOS_PER_ATTACK, MAX_CHAOS_LEVEL);
      const attackPower = attacker.power * 0.4;
      const success = attackPower > territory.defensePower;

      let newTerritories = prev.territories;
      let newFactions = prev.factions;
      let event: ChaosEvent;

      if (success) {
        const oldOwner = territory.ownerFactionId;
        newTerritories = prev.territories.map(t =>
          t.zoneId === zoneId
            ? { ...t, ownerFactionId: factionId, defensePower: attackPower * 0.5, lastContested: Date.now() }
            : t
        );
        newFactions = prev.factions.map(f => {
          if (f.id === factionId) return { ...f, power: f.power - 20, territoryCount: f.territoryCount + 1 };
          if (f.id === oldOwner) return { ...f, territoryCount: Math.max(0, f.territoryCount - 1) };
          return f;
        });
        event = {
          id: generateId(),
          type: 'capture',
          message: getRandomMessage('capture', {
            faction: FACTION_NAMES_MAP[factionId],
            zone: territory.label,
            target: FACTION_NAMES_MAP[oldOwner],
          }),
          timestamp: Date.now(),
          factionId,
          targetFactionId: oldOwner,
        };
        triggerShake();
      } else {
        newFactions = prev.factions.map(f =>
          f.id === factionId ? { ...f, power: Math.max(0, f.power - 20) } : f
        );
        event = {
          id: generateId(),
          type: 'attack',
          message: `💥 ${FACTION_NAMES_MAP[factionId]} failed to capture ${territory.label}!`,
          timestamp: Date.now(),
          factionId,
        };
      }

      const newState = {
        ...prev,
        chaosLevel: newChaos,
        totalTransactions: prev.totalTransactions + 1,
        territories: newTerritories,
        factions: newFactions,
        events: [event, ...prev.events].slice(0, 50),
      };

      // Run chaos check after attack too
      const chaosEvent = chaosCheck(newChaos, newState.totalTransactions);
      if (chaosEvent) {
        newState.events = [chaosEvent, ...newState.events].slice(0, 50);
        newState.chaosLevel = Math.min(newChaos + 5, MAX_CHAOS_LEVEL);
      }

      return newState;
    });
  }, [chaosCheck, triggerShake]);

  // Join faction
  const joinFaction = useCallback((factionId: number) => {
    setWorld(prev => ({
      ...prev,
      chaosLevel: Math.min(prev.chaosLevel + CHAOS_PER_JOIN, MAX_CHAOS_LEVEL),
      factions: prev.factions.map(f =>
        f.id === factionId ? { ...f, memberCount: f.memberCount + 1, power: f.power + 10 } : f
      ),
      events: [{
        id: generateId(),
        type: 'join' as ChaosEventType,
        message: getRandomMessage('join', { faction: FACTION_NAMES_MAP[factionId] }),
        timestamp: Date.now(),
        factionId,
      }, ...prev.events].slice(0, 50),
    }));
  }, []);

  return {
    world,
    isShaking,
    executeTrade,
    attackTerritory,
    joinFaction,
  };
}
