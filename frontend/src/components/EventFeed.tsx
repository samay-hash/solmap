'use client';

import { FC, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChaosEvent } from '@/lib/types';

interface Props {
  events: ChaosEvent[];
}

const typeColors: Record<string, string> = {
  war: 'var(--neon-red)',
  betrayal: 'var(--neon-pink)',
  airdrop: 'var(--neon-green)',
  trade: 'var(--neon-cyan)',
  attack: '#f97316',
  capture: 'var(--neon-yellow)',
  join: 'var(--neon-purple)',
};

export const EventFeed: FC<Props> = ({ events }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events.length]);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        fontWeight: 600,
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span style={{
          width: 6, height: 6,
          borderRadius: '50%',
          background: 'var(--neon-green)',
          display: 'inline-block',
          animation: 'pulse-glow 1.5s infinite',
        }} />
        Live Events
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <AnimatePresence initial={false}>
          {events.map(event => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className={`event-item ${event.type}`}
              style={{
                borderLeftColor: typeColors[event.type] || 'var(--neon-purple)',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 8,
              }}>
                <span style={{ flex: 1, lineHeight: 1.4 }}>
                  {event.message}
                </span>
                <span style={{
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'JetBrains Mono, monospace',
                  whiteSpace: 'nowrap',
                }}>
                  {formatTime(event.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.8125rem',
            padding: '2rem 0',
          }}>
            No events yet. Start trading to create chaos! ⚡
          </div>
        )}
      </div>
    </div>
  );
};
