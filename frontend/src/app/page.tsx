'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

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

const SpiderWeb = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: {x: number, y: number, vx: number, vy: number}[] = [];
    let animationFrame: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles = [];
      const numParticles = Math.floor((width * height) / 12000); // denser
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 0.8;
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.6)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.8 - dist / 140})`;
            ctx.stroke();
          }
        }
      }
      animationFrame = requestAnimationFrame(draw);
    };

    init();
    draw();

    window.addEventListener('resize', init);
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
      }} 
    />
  );
};

const fade = (d = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] } });

export default function LandingPage() {
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
    { n: '01', icon: '🔗', t: 'Connect Wallet', d: 'Link your Phantom or Solflare wallet to enter the map.' },
    { n: '02', icon: '🏛️', t: 'Choose Faction', d: 'Crimson Order, Azure Legion, or Emerald Pact — pick your side.' },
    { n: '03', icon: '💰', t: 'Trade Power', d: 'Every SOL traded converts to faction power. The chaos level rises.' },
    { n: '04', icon: '🧨', t: 'Chaos Engine Fires', d: 'On-chain probability rolls trigger wars, betrayals, or airdrops.' },
    { n: '05', icon: '⚔️', t: 'Conquer Territory', d: 'Attack hex zones on the world map. Your faction power vs. defense.' },
    { n: '06', icon: '🌀', t: 'World Evolves', d: 'AI agents act, events cascade, territories flip — the world never sleeps.' },
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

      <SpiderWeb />

      <div className="lp-content-layer" style={{ position: 'relative', zIndex: 5 }}>
        {/* NAV */}
        <nav className="lp-nav" style={{ background: 'rgba(7,8,15,0.4)', backdropFilter: 'blur(16px)' }}>
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
        <section className="lp-hero" style={{ padding: '0 0 80px 64px' }}>
          <motion.div className="lp-hero-content" {...fade(0)}>
            <div className="lp-tag">
              <div className="line" />
              <div className="dot" />
              <span>Solmap · EST. 2026</span>
            </div>

            <h1>
              Every<br />
              Transaction<br />
              <span className="accent">Changes Reality.</span>
            </h1>

            <p className="lp-hero-desc">
              A living blockchain map where factions battle for territory, a chaos engine triggers
              unpredictable events, and AI agents play alongside you — all on-chain, all on Solana.
            </p>

            <div className="lp-hero-btns">
              <Link href="/world" className="lp-cta-btn">Explore Map →</Link>
              <a href="#how-it-works" className="lp-watch">▶ View Mechanics</a>
            </div>
          </motion.div>

          {/* Terminal */}
          <motion.div className="lp-terminal" {...fade(0.3)}>
            <div className="lp-terminal-head">
              <div className="lp-terminal-dot" style={{ background: '#ef4444' }} />
              <div className="lp-terminal-dot" style={{ background: '#f59e0b' }} />
              <div className="lp-terminal-dot" style={{ background: '#10b981' }} />
              <span className="lp-terminal-title">solmap_engine — mainnet</span>
            </div>
            <div className="lp-terminal-body" style={{ background: 'rgba(0,0,0,0.4)' }}>
              {typed}<span className="lp-cursor" />
            </div>
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section className="lp-section" id="how-it-works">
          <div className="lp-section-inner">
            <span className="lp-section-tag" style={{ color: '#a855f7' }}>Protocol</span>
            <h2>How It Works</h2>
            <p className="lp-section-sub">Six steps from wallet connect to map domination.</p>
            <div className="lp-steps">
              {steps.map(s => (
                <div key={s.n} className="lp-step" style={{ background: 'rgba(13,15,26,0.6)', backdropFilter: 'blur(10px)' }}>
                  <span className="lp-step-num">{s.n}</span>
                  <div className="lp-step-icon">{s.icon}</div>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CHAOS ENGINE */}
        <section className="lp-section" id="chaos-engine">
          <div className="lp-section-inner">
            <div className="lp-split">
              <div className="lp-code-block" style={{ background: 'rgba(8,10,20,0.7)', backdropFilter: 'blur(10px)' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}>{'// on-chain chaos engine (Rust/Anchor)'}</div>
                <div><span style={{ color: '#c084fc' }}>let</span> seed = clock.timestamp <span style={{ color: '#94a3b8' }}>^</span> total_tx <span style={{ color: '#94a3b8' }}>^</span> chaos_level;</div>
                <div><span style={{ color: '#c084fc' }}>let</span> roll = seed <span style={{ color: '#94a3b8' }}>%</span> <span style={{ color: '#22d3ee' }}>100</span>;</div>
                <div style={{ marginTop: 8 }}><span style={{ color: '#c084fc' }}>if</span> chaos {'>'} <span style={{ color: '#22d3ee' }}>80</span> && roll {'<'} <span style={{ color: '#22d3ee' }}>25</span> {'{'}</div>
                <div style={{ paddingLeft: 20, color: '#ef4444' }}>→ WAR_EVENT</div>
                <div>{'}'} <span style={{ color: '#c084fc' }}>else if</span> chaos {'>'} <span style={{ color: '#22d3ee' }}>50</span> && roll {'<'} <span style={{ color: '#22d3ee' }}>12</span> {'{'}</div>
                <div style={{ paddingLeft: 20, color: '#ec4899' }}>→ BETRAYAL</div>
                <div>{'}'} <span style={{ color: '#c084fc' }}>else if</span> roll {'<'} <span style={{ color: '#22d3ee' }}>8</span> {'{'}</div>
                <div style={{ paddingLeft: 20, color: '#10b981' }}>→ AIRDROP</div>
                <div>{'}'}</div>
              </div>
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
              On-chain programs, real-time backend, and a visual frontend — all integrated.
            </p>
            <div className="lp-arch-grid">
              {arch.map(a => (
                <div key={a.layer} className="lp-arch-card" style={{ textAlign: 'left', background: 'rgba(13,15,26,0.6)', backdropFilter: 'blur(10px)' }}>
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
