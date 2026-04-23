'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function useTyper(lines: string[], speed = 30) {
  const [text, setText] = useState('');
  const [li, setLi] = useState(0);
  const [ci, setCi] = useState(0);
  const [ok, setOk] = useState(false);
  useEffect(() => { setOk(true); }, []);
  useEffect(() => {
    if (!ok || li >= lines.length) return;
    const line = lines[li];
    if (ci <= line.length) {
      const t = setTimeout(() => {
        setText(lines.slice(0, li).join('\n') + (li > 0 ? '\n' : '') + line.slice(0, ci));
        setCi(c => c + 1);
      }, speed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setLi(i => i + 1); setCi(0); }, 350);
    return () => clearTimeout(t);
  }, [ci, li, lines, speed, ok]);
  return ok ? text : '';
}

const WordByWord = ({ text }: { text: string }) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 * i },
    }),
  };

  const child = {
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
    hidden: { opacity: 0, y: 10 },
  };

  return (
    <motion.div
      style={{ display: "inline-block", overflow: "hidden" }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span variants={child} style={{ marginRight: "4px", display: "inline-block" }} key={index}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const fade = (d = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] } });

export default function LandingPage() {
  const [archSpread, setArchSpread] = useState(false);
  const typed = useTyper([
    '> initializing solmap_engine v0.1.0...',
    '> connecting to solana mainnet...',
    '> loading world_state [3 factions | 7 zones]',
    '> chaos_level: 0 → monitoring transactions...',
    '> trade detected: +50 power → Crimson Order',
    '> chaos_check() → roll: 7 → ✨ AIRDROP triggered!',
    '> ⚔️  WAR EVENT: Azure Legion attacks Emerald Pact',
    '> reality is shifting. 🌀',
  ]);


  const steps = [
    { n: 'PHASE 01', t: 'Connect Wallet', d: 'Link your Phantom or Solflare wallet to enter the map. No complex onboarding.' },
    { n: 'PHASE 02', t: 'Choose Faction', d: 'Crimson Order, Azure Legion, or Emerald Pact — pick your side and align your strategy.' },
    { n: 'PHASE 03', t: 'Trade Power', d: 'Every SOL traded converts to faction power. The global chaos level rises with every transaction.' },
    { n: 'PHASE 04', t: 'Chaos Engine Fires', d: 'On-chain probability rolls trigger wars, betrayals, or airdrops deterministically.' },
    { n: 'PHASE 05', t: 'Conquer Territory', d: 'Attack hex zones on the world map. It is your faction power vs. their defense.' },
    { n: 'PHASE 06', t: 'World Evolves', d: 'AI agents act, events cascade, territories flip — the world never sleeps. All entirely on-chain.' },
  ];

  const events = [
    { emoji: '⚔️', name: 'War', desc: 'Strongest faction auto-attacks weakest', thresh: 'chaos > 80', c: '#ef4444' },
    { emoji: '🗡️', name: 'Betrayal', desc: 'Internal sabotage cripples a faction', thresh: 'chaos > 50', c: '#ec4899' },
    { emoji: '✨', name: 'Airdrop', desc: 'Random faction gets a power surge', thresh: 'any time', c: '#10b981' },
  ];

  const arch = [
    { layer: 'On-Chain', tech: 'Anchor / Rust', desc: 'Programs deployed on Solana. World state, factions, chaos engine.', c: '#9945FF' },
    { layer: 'Backend', tech: 'Node.js + WS', desc: 'WebSocket server streams events. AI bot agents trade & attack.', c: '#22d3ee' },
    { layer: 'Frontend', tech: 'Next.js + Motion', desc: 'Live hex map, event feed, chaos bar — all animated in real-time.', c: '#10b981' },
    { layer: 'Wallet', tech: 'Phantom / Solflare', desc: 'Connect, sign transactions, interact with the chain directly.', c: '#f59e0b' },
  ];

  const stats = [
    { val: '6', lab: 'On-Chain Instructions', sub: 'init · faction · join · trade · attack · chaos' },
    { val: '3', lab: 'AI Bot Agents', sub: 'Trade, attack & join every 15-30s' },
    { val: '~400ms', lab: 'Block Time', sub: 'Solana L1 finality' },
    { val: '100', lab: 'Max Chaos Level', sub: 'The higher it goes, the wilder it gets' },
  ];

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      backgroundImage: 'url("/bg-texture.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#fff'
    }}>
      {/* Background Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(7,8,15,0.7) 0%, rgba(7,8,15,0.92) 100%)',
        zIndex: 0
      }} />

      <div className="lp-content-layer" style={{ position: 'relative', zIndex: 5 }}>
        {/* NAV */}
        <nav className="lp-nav" style={{ background: 'transparent', backdropFilter: 'none', borderBottom: 'none' }}>
          <Link href="/" className="lp-nav-logo">
            <span style={{ color: '#22d3ee' }}>🌀</span>
            <span>Solmap</span>
          </Link>
          <div className="lp-nav-links">
            <a href="#how-it-works">Workflow</a>
            <a href="#chaos-engine">Features</a>
            <a href="#architecture">Architecture</a>
          </div>
          <div className="lp-nav-right">
            <a href="#stats" className="login">Stats</a>
            <Link href="/world" className="lp-cta-btn">Enter Solmap →</Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="lp-hero" style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <motion.div className="lp-hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px', maxWidth: '800px', margin: '0 auto' }} {...fade(0)}>
            <div className="lp-tag" style={{ justifyContent: 'center', marginBottom: '24px' }}>
              <div className="line" />
              <div className="dot" />
              <span>Solmap · EST. 2026</span>
              <div className="dot" />
              <div className="line" />
            </div>

            <div className="elegant-text-wrapper" style={{ marginTop: '20px', marginBottom: '32px' }}>
              <span className="elegant-line" style={{ letterSpacing: '0.2em' }}>EVERY</span>
              <span className="elegant-line bold" style={{ fontSize: 'clamp(3.5rem, 7vw, 6.5rem)', marginTop: '-5px' }}>TRANSACTION</span>
              <span className="elegant-line elegant-serif" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '15px' }}>
                <span style={{ height: '1px', background: 'rgba(255,255,255,0.4)', width: '80px' }}></span>
                <span style={{ fontStyle: 'italic', color: '#e2e8f0', fontWeight: 400 }}>CHANGES</span> REALITY.
                <span style={{ height: '1px', background: 'rgba(255,255,255,0.4)', width: '80px' }}></span>
              </span>
            </div>

            <div className="lp-hero-desc" style={{ textAlign: 'center', margin: '0 auto 40px auto' }}>
              <WordByWord text="A living blockchain map where factions battle for territory, a chaos engine triggers unpredictable events, and AI agents play alongside you — all on-chain, all on Solana." />
            </div>

            <div className="lp-hero-btns" style={{ justifyContent: 'center' }}>
              <Link href="/world" className="lp-cta-btn">Explore Map →</Link>
              <a href="#how-it-works" className="lp-watch">▶ View Mechanics</a>
            </div>
          </motion.div>
        </section>

        {/* HOW IT WORKS (Vertical Timeline) */}
        <section className="lp-section" id="how-it-works">
          <div className="lp-section-inner" style={{ maxWidth: '800px' }}>
            <span className="lp-section-tag" style={{ color: '#a855f7' }}>Protocol</span>
            <h2>Workflow</h2>
            <p className="lp-section-sub">Six phases from wallet connect to map domination.</p>
            
            <div className="lp-timeline">
              <div className="lp-timeline-line"></div>
              {steps.map((s, i) => (
                <div key={s.n} className="lp-timeline-item">
                  <div className="lp-timeline-dot"></div>
                  <div className="lp-timeline-content">
                    <span className="lp-phase">{s.n}</span>
                    <h4>{s.t}</h4>
                    <p>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CHAOS ENGINE */}
        <section className="lp-section" id="chaos-engine">
          <div className="lp-section-inner">
            <div className="lp-split">
              <motion.div className="lp-terminal-pro" style={{ position: 'relative', right: 'auto', bottom: 'auto', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }} {...fade(0.3)}>
                <div className="pro-header">
                  <div className="dots">
                    <div style={{ background: '#ef4444' }} />
                    <div style={{ background: '#f59e0b' }} />
                    <div style={{ background: '#10b981' }} />
                  </div>
                  <div className="title">engine.rs</div>
                  <div className="right-badge">Rust</div>
                </div>
                <div className="pro-body" style={{ minHeight: '320px' }}>
                  <div className="line-numbers">
                    {Array.from({length: 8}).map((_, i) => <span key={i}>{i+1}</span>)}
                  </div>
                  <div className="code-content">
                    {typed}<span className="lp-cursor" />
                  </div>
                </div>
              </motion.div>
              <div>
                <span className="lp-section-tag" style={{ color: '#ef4444' }}>The Game Changer</span>
                <h2>Chaos Engine</h2>
                <p className="lp-section-sub">
                  Every on-chain transaction runs a deterministic probability check. The higher the chaos
                  level, the more likely wars, betrayals, and power surges happen — automatically.
                </p>
                <div className="lp-event-rows">
                  {events.map(e => (
                    <div key={e.name} className="lp-event-row" style={{ borderColor: e.c + '25', background: e.c + '08', backdropFilter: 'blur(10px)' }}>
                      <span style={{ fontSize: '1.3rem' }}>{e.emoji}</span>
                      <div className="info">
                        <h5>{e.name}</h5>
                        <p>{e.desc}</p>
                      </div>
                      <span className="badge" style={{ color: e.c, background: e.c + '12' }}>{e.thresh}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ARCHITECTURE */}
        <section className="lp-section" id="architecture">
          <div className="lp-section-inner" style={{ textAlign: 'center' }}>
            <span className="lp-section-tag" style={{ color: '#22d3ee' }}>Tech Stack</span>
            <h2>Full-Stack Architecture</h2>
            <p className="lp-section-sub" style={{ margin: '0 auto 0' }}>
              Click to reveal the core engine modules.
            </p>
            <div className={`arch-radial-container ${archSpread ? 'is-spread' : ''}`} onClick={() => setArchSpread(!archSpread)} style={{ cursor: 'pointer' }}>
              {arch.map((a, i) => (
                <div key={a.layer} className={`arch-card-spread ${archSpread ? `arch-spread-${i}` : ''}`} style={{ zIndex: 4 - i }}>
                  <div className="lp-arch-dot" style={{ background: a.c, boxShadow: `0 0 12px ${a.c}60` }} />
                  <div className="layer">{a.layer}</div>
                  <h4>{a.tech}</h4>
                  <p>{a.desc}</p>
                </div>
              ))}
            </div>
            <div className="lp-flow" style={{ background: 'rgba(8,10,20,0.6)', backdropFilter: 'blur(10px)' }}>
              <span style={{ color: '#a855f7' }}>User trades</span><span>→</span>
              <span style={{ color: '#9945FF' }}>On-chain program</span><span>→</span>
              <span style={{ color: '#ef4444' }}>chaos_check()</span><span>→</span>
              <span style={{ color: '#f59e0b' }}>Event emitted</span><span>→</span>
              <span style={{ color: '#22d3ee' }}>WebSocket</span><span>→</span>
              <span style={{ color: '#10b981' }}>Map + Feed update</span>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="lp-section" id="stats">
          <div className="lp-section-inner">
            <div className="lp-stats-grid" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(34,211,238,0.05))', backdropFilter: 'blur(10px)' }}>
              {stats.map(s => (
                <div key={s.lab}>
                  <div className="lp-stat-val">{s.val}</div>
                  <div className="lp-stat-lab">{s.lab}</div>
                  <div className="lp-stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="lp-final-cta">
          <h2>Ready to shape reality?</h2>
          <p>Connect your wallet, join a faction, and watch the chaos unfold.</p>
          <Link href="/world" className="lp-cta-btn" style={{ padding: '14px 36px' }}>⚡ Enter Solmap</Link>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer" style={{ background: 'rgba(7,8,15,0.4)', backdropFilter: 'blur(10px)' }}>
          <span>🌀 Solmap · Built on <span className="sol">Solana</span></span>
          <span>Solana Hackathon 2026</span>
        </footer>
      </div>
    </div>
  );
}

