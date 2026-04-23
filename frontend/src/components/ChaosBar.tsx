'use client';

import { FC, useMemo } from 'react';
import { CHAOS_LOW, CHAOS_MEDIUM, CHAOS_HIGH, CHAOS_CRITICAL } from '@/lib/constants';

interface Props {
  level: number;
  maxLevel?: number;
}

export const ChaosBar: FC<Props> = ({ level, maxLevel = 100 }) => {
  const percentage = Math.min((level / maxLevel) * 100, 100);

  const { className, label, emoji } = useMemo(() => {
    if (level >= CHAOS_CRITICAL) return { className: 'critical', label: 'CRITICAL', emoji: '💀' };
    if (level >= CHAOS_HIGH) return { className: 'high', label: 'HIGH', emoji: '🔥' };
    if (level >= CHAOS_MEDIUM) return { className: 'medium', label: 'RISING', emoji: '⚡' };
    return { className: 'low', label: 'STABLE', emoji: '🌊' };
  }, [level]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
      }}>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600,
        }}>
          {emoji} Chaos Level
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: className === 'critical' ? 'var(--neon-red)' :
                 className === 'high' ? '#f97316' :
                 className === 'medium' ? 'var(--neon-yellow)' :
                 'var(--neon-green)',
        }}>
          {level}/{maxLevel} — {label}
        </span>
      </div>
      <div className="chaos-bar-wrapper">
        <div
          className={`chaos-bar-fill ${className}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
