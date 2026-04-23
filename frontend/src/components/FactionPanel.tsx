'use client';

import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Faction } from '@/lib/types';
import { FACTION_COLORS } from '@/lib/constants';

interface Props {
  factions: Faction[];
  playerFactionId: number;
  onJoinFaction: (factionId: number) => void;
  onTrade: (factionId: number, amount: number) => void;
}

export const FactionPanel: FC<Props> = ({ factions, playerFactionId, onJoinFaction, onTrade }) => {
  const [tradeAmount, setTradeAmount] = useState(1);

  const maxPower = Math.max(...factions.map(f => f.power), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        fontWeight: 600,
        marginBottom: 4,
      }}>
        ◆ Factions
      </div>

      {factions.map((faction, idx) => {
        const color = FACTION_COLORS[faction.id] || '#475569';
        const powerPercent = (faction.power / maxPower) * 100;
        const isJoined = playerFactionId === faction.id;

        return (
          <motion.div
            key={faction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card"
            style={{
              padding: 14,
              borderColor: isJoined ? color : 'var(--border-default)',
              borderWidth: isJoined ? 2 : 1,
            }}
          >
            {/* Faction header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}>
              <div style={{
                width: 10, height: 10,
                borderRadius: '50%',
                background: color,
                boxShadow: `0 0 8px ${color}60`,
              }} />
              <span style={{ fontWeight: 700, fontSize: '0.9375rem', flex: 1 }}>
                {faction.name}
              </span>
              {isJoined && (
                <span style={{
                  fontSize: '0.6875rem',
                  color: color,
                  fontWeight: 600,
                  background: `${color}15`,
                  padding: '2px 8px',
                  borderRadius: 99,
                }}>
                  JOINED
                </span>
              )}
            </div>

            {/* Power bar */}
            <div style={{ marginBottom: 8 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                marginBottom: 4,
              }}>
                <span>Power</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: color }}>
                  {faction.power}
                </span>
              </div>
              <div style={{
                width: '100%',
                height: 4,
                background: 'var(--bg-tertiary)',
                borderRadius: 99,
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${powerPercent}%` }}
                  transition={{ duration: 0.8 }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${color}, ${color}80)`,
                    borderRadius: 99,
                    boxShadow: `0 0 8px ${color}40`,
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: 12,
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginBottom: 10,
            }}>
              <span>👥 {faction.memberCount} members</span>
              <span>🏰 {faction.territoryCount} zones</span>
            </div>

            {/* Actions */}
            {playerFactionId === 0 && (
              <button
                className="btn btn-outline btn-sm"
                style={{ width: '100%', borderColor: color, color: color }}
                onClick={() => onJoinFaction(faction.id)}
              >
                Join {faction.name}
              </button>
            )}

            {isJoined && (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={tradeAmount}
                  onChange={e => setTradeAmount(Number(e.target.value))}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.8125rem',
                    outline: 'none',
                  }}
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onTrade(faction.id, tradeAmount)}
                >
                  ⚡ Trade
                </button>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Leaderboard */}
      <div style={{
        marginTop: 8,
        padding: 14,
        background: 'var(--bg-glass)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)',
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600,
          marginBottom: 10,
        }}>
          🏆 Power Rankings
        </div>
        {[...factions]
          .sort((a, b) => b.power - a.power)
          .map((f, i) => (
            <div key={f.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 0',
              borderBottom: i < factions.length - 1 ? '1px solid var(--border-default)' : 'none',
              fontSize: '0.8125rem',
            }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)', width: 16 }}>
                {i + 1}.
              </span>
              <span style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: FACTION_COLORS[f.id],
              }} />
              <span style={{ flex: 1 }}>{f.name}</span>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                color: FACTION_COLORS[f.id],
                fontWeight: 600,
              }}>
                {f.power}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};
