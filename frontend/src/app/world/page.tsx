'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WorldMap } from '@/components/WorldMap';
import { ChaosBar } from '@/components/ChaosBar';
import { EventFeed } from '@/components/EventFeed';
import { FactionPanel } from '@/components/FactionPanel';
import { useWorldState } from '@/hooks/useWorldState';
import Link from 'next/link';

export default function WorldPage() {
  const { connected } = useWallet();
  const { world, isShaking, executeTrade, attackTerritory, joinFaction } = useWorldState();
  const [playerFactionId, setPlayerFactionId] = useState(0);

  const handleJoinFaction = (factionId: number) => {
    setPlayerFactionId(factionId);
    joinFaction(factionId);
  };

  const handleTrade = (factionId: number, amount: number) => {
    executeTrade(factionId, amount);
  };

  const handleAttack = (zoneId: number) => {
    if (playerFactionId === 0) return;
    attackTerritory(playerFactionId, zoneId);
  };

  return (
    <div className={isShaking ? 'shake' : ''} style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header className="header">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="logo">
            SOLMAP
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Transaction counter */}
          <div className="stat-badge">
            <span style={{ color: 'var(--neon-cyan)' }}>📊</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
              TX: {world.totalTransactions}
            </span>
          </div>

          {/* Player faction badge */}
          {playerFactionId > 0 && (
            <div className="stat-badge" style={{
              borderColor: world.factions.find(f => f.id === playerFactionId)?.color,
            }}>
              <span style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: world.factions.find(f => f.id === playerFactionId)?.color,
                display: 'inline-block',
              }} />
              <span style={{ fontSize: '0.75rem' }}>
                {world.factions.find(f => f.id === playerFactionId)?.name}
              </span>
            </div>
          )}

          <WalletMultiButton />
        </div>
      </header>

      {/* Main content */}
      <div className="world-layout">
        {/* Left Panel — Factions */}
        <div className="panel glass-card" style={{ overflow: 'auto' }}>
          <FactionPanel
            factions={world.factions}
            playerFactionId={playerFactionId}
            onJoinFaction={handleJoinFaction}
            onTrade={handleTrade}
          />
        </div>

        {/* Center — Map + Chaos Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          {/* Chaos bar */}
          <div className="glass-card" style={{ padding: '14px 18px' }}>
            <ChaosBar level={world.chaosLevel} />
          </div>

          {/* World Map */}
          <div className="glass-card" style={{ flex: 1, padding: 8, minHeight: 0 }}>
            <WorldMap
              territories={world.territories}
              chaosLevel={world.chaosLevel}
              onAttack={handleAttack}
              playerFactionId={playerFactionId}
            />
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 12 }}>
            {world.factions.map(f => (
              <div
                key={f.id}
                className="glass-card"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div style={{
                  width: 10, height: 10,
                  borderRadius: '50%',
                  background: f.color,
                  boxShadow: `0 0 8px ${f.color}60`,
                }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.name}</div>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    color: f.color,
                  }}>
                    {f.power}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel — Events */}
        <div className="panel glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <EventFeed events={world.events} />
        </div>
      </div>
    </div>
  );
}
