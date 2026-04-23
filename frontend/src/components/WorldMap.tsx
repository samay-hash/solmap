'use client';

import { FC, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Territory } from '@/lib/types';
import { FACTION_COLORS, FACTION_NAMES } from '@/lib/constants';

interface Props {
  territories: Territory[];
  chaosLevel: number;
  onAttack: (zoneId: number) => void;
  playerFactionId: number;
}

const HEX_RADIUS = 55;

function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

export const WorldMap: FC<Props> = ({ territories, chaosLevel, onAttack, playerFactionId }) => {
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);
  const [explosions, setExplosions] = useState<{ id: string; x: number; y: number }[]>([]);

  const triggerExplosion = (x: number, y: number) => {
    const id = Math.random().toString(36).slice(2);
    setExplosions(prev => [...prev, { id, x, y }]);
    setTimeout(() => setExplosions(prev => prev.filter(e => e.id !== id)), 1000);
  };

  const handleAttack = (zone: Territory) => {
    if (zone.ownerFactionId === playerFactionId) return;
    onAttack(zone.zoneId);
    triggerExplosion(zone.x, zone.y);
    setSelectedZone(null);
  };

  // Background pulse based on chaos level
  const bgPulse = useMemo(() => {
    if (chaosLevel > 80) return 'rgba(239, 68, 68, 0.08)';
    if (chaosLevel > 50) return 'rgba(245, 158, 11, 0.05)';
    return 'rgba(168, 85, 247, 0.03)';
  }, [chaosLevel]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: 500,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: `radial-gradient(circle at center, ${bgPulse}, transparent 70%)`,
    }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 12,
        left: 16,
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        fontWeight: 600,
      }}>
        ◆ World Map
      </div>

      <svg
        viewBox="0 0 800 550"
        style={{ width: '100%', height: '100%' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148,163,184,0.06)" strokeWidth="0.5" />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bigGlow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="800" height="550" fill="url(#grid)" />

        {/* Connection lines between territories */}
        {territories.map((t, i) =>
          territories.slice(i + 1).map(t2 => {
            const dist = Math.sqrt((t.x - t2.x) ** 2 + (t.y - t2.y) ** 2);
            if (dist > 250) return null;
            return (
              <line
                key={`${t.zoneId}-${t2.zoneId}`}
                x1={t.x} y1={t.y}
                x2={t2.x} y2={t2.y}
                stroke="rgba(148,163,184,0.08)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })
        )}

        {/* Territory hexagons */}
        {territories.map(zone => {
          const color = FACTION_COLORS[zone.ownerFactionId] || '#475569';
          const isHovered = hoveredZone === zone.zoneId;
          const isSelected = selectedZone === zone.zoneId;
          const isContested = zone.ownerFactionId === 0;
          const isOwned = zone.ownerFactionId === playerFactionId;

          return (
            <g
              key={zone.zoneId}
              className={`hex-zone ${isContested ? 'contested' : ''}`}
              onClick={() => setSelectedZone(isSelected ? null : zone.zoneId)}
              onMouseEnter={() => setHoveredZone(zone.zoneId)}
              onMouseLeave={() => setHoveredZone(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer glow */}
              <polygon
                points={hexPoints(zone.x, zone.y, HEX_RADIUS + 4)}
                fill="none"
                stroke={color}
                strokeWidth="1"
                opacity={isHovered ? 0.6 : 0.15}
                filter="url(#glow)"
              />

              {/* Main hex */}
              <polygon
                points={hexPoints(zone.x, zone.y, HEX_RADIUS)}
                fill={`${color}${isHovered ? '30' : '18'}`}
                stroke={color}
                strokeWidth={isSelected ? 3 : 1.5}
                opacity={isHovered ? 1 : 0.8}
              />

              {/* Inner pattern */}
              <polygon
                points={hexPoints(zone.x, zone.y, HEX_RADIUS - 12)}
                fill="none"
                stroke={color}
                strokeWidth="0.5"
                opacity={0.2}
                strokeDasharray="3 3"
              />

              {/* Zone label */}
              <text
                x={zone.x}
                y={zone.y - 8}
                textAnchor="middle"
                fill="var(--text-primary)"
                fontSize="11"
                fontWeight="600"
                fontFamily="Outfit, sans-serif"
              >
                {zone.label}
              </text>

              {/* Owner text */}
              <text
                x={zone.x}
                y={zone.y + 10}
                textAnchor="middle"
                fill={color}
                fontSize="9"
                fontWeight="500"
                fontFamily="Outfit, sans-serif"
                opacity="0.8"
              >
                {FACTION_NAMES[zone.ownerFactionId]}
              </text>

              {/* Defense power */}
              <text
                x={zone.x}
                y={zone.y + 24}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
              >
                DEF: {Math.round(zone.defensePower)}
              </text>

              {/* Pulsing dot for contested zones */}
              {isContested && (
                <>
                  <circle cx={zone.x} cy={zone.y - 25} r="3" fill="#f59e0b">
                    <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </>
              )}
            </g>
          );
        })}

        {/* Explosion effects */}
        {explosions.map(e => (
          <g key={e.id}>
            <circle cx={e.x} cy={e.y} r="10" fill="rgba(239,68,68,0.6)" filter="url(#bigGlow)">
              <animate attributeName="r" from="10" to="80" dur="0.8s" fill="freeze" />
              <animate attributeName="opacity" from="0.8" to="0" dur="0.8s" fill="freeze" />
            </circle>
            <circle cx={e.x} cy={e.y} r="5" fill="rgba(245,158,11,0.8)">
              <animate attributeName="r" from="5" to="50" dur="0.6s" fill="freeze" />
              <animate attributeName="opacity" from="1" to="0" dur="0.6s" fill="freeze" />
            </circle>
          </g>
        ))}
      </svg>

      {/* Selected zone action panel */}
      <AnimatePresence>
        {selectedZone !== null && (() => {
          const zone = territories.find(t => t.zoneId === selectedZone);
          if (!zone) return null;
          const isOwned = zone.ownerFactionId === playerFactionId;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                minWidth: 360,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{zone.label}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                  Owner: {FACTION_NAMES[zone.ownerFactionId]} · Defense: {Math.round(zone.defensePower)}
                </div>
              </div>
              {!isOwned && playerFactionId > 0 && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleAttack(zone)}
                >
                  ⚔️ Attack
                </button>
              )}
              {isOwned && (
                <span className="stat-badge" style={{ color: 'var(--neon-green)' }}>
                  ✓ Your Territory
                </span>
              )}
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedZone(null)}
              >
                ✕
              </button>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
