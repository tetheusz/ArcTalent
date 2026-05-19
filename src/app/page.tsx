'use client'

import Link from 'next/link'
import { Sparkles, Hexagon, Shield, Award, Globe, Zap, ArrowRight, ChevronDown } from 'lucide-react'
import styles from './page.module.css'
import LandingNavbar from '@/components/LandingNavbar'
import dynamic from 'next/dynamic'
import { useEffect, useState, useRef } from 'react'

const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false })

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={styles.landing}>
      {/* Full immersive 3D background — hero only */}
      {mounted && <Scene3D />}
      <LandingNavbar />

      {/* Side navigation — Hubtown style */}
      <div className={styles.sideNav}>
        <div 
          className={`${styles.sideNavItem} ${styles.active}`}
          onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className={styles.sideNavDot}></span>
          REPUTATION
        </div>
        <div className={styles.sideNavItem} onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>MISSIONS</div>
        <div className={styles.sideNavItem} onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>PROTOCOLS</div>
        <div className={styles.sideNavItem} onClick={() => document.getElementById('for-protocols')?.scrollIntoView({ behavior: 'smooth' })}>ON-CHAIN</div>
        <div className={styles.sideNavItem} onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}>BUILDERS</div>
      </div>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section id="hero" className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            THE REPUTATION LAYER<br />
            FOR ARC NETWORK
          </h1>
          <p className={styles.heroSub}>
            Build verifiable on-chain reputation through meaningful contributions.
            Complete missions, submit proof, and grow your presence across the ecosystem.
          </p>
          <Link href="/missions" className={styles.ctaBtn}>
            <Sparkles size={14} />
            EXPLORE MISSIONS
          </Link>
        </div>

        <div className={styles.scrollHint}>
          <ChevronDown size={20} />
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section id="how-it-works" className={styles.sectionDark}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>THE PROCESS</div>
          <h2 className={styles.sectionTitle}>HOW IT WORKS</h2>
          <p className={styles.sectionSub}>
            From zero to on-chain reputation in three steps.
          </p>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>01</div>
              <div className={styles.stepIcon}><Zap size={28} /></div>
              <h3>DISCOVER</h3>
              <p>Browse curated missions from verified protocols. QA, research, development, content — find what matches your expertise.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>02</div>
              <div className={styles.stepIcon}><Shield size={28} /></div>
              <h3>CONTRIBUTE</h3>
              <p>Submit proof of contribution. Every submission is human-reviewed by protocol administrators with verifiable standards.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>03</div>
              <div className={styles.stepIcon}><Award size={28} /></div>
              <h3>EARN</h3>
              <p>Receive reputation points and Soulbound Tokens. Build a permanent, non-transferable on-chain identity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURES BENTO ═══════════════════ */}
      <section id="features" className={styles.sectionDark}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>ARCHITECTURE</div>
          <h2 className={styles.sectionTitle}>BEYOND CLICK-FARMING</h2>
          <p className={styles.sectionSub}>
            A trust-first contribution layer designed for high-signal protocol activation.
          </p>

          <div className={styles.bentoGrid}>
            <div className={`${styles.bentoCard} ${styles.bentoLarge}`}>
              <div className={styles.bentoIcon}><Hexagon size={36} /></div>
              <h3>Meaningful Missions</h3>
              <p>QA, Research, Content, and Tech tasks designed for real impact — not volume. Every mission is manually curated and approved before going live on the network.</p>
              <div className={styles.bentoGlow}></div>
            </div>
            <div className={styles.bentoCard}>
              <div className={styles.bentoIcon}><Shield size={36} /></div>
              <h3>Verified Proof</h3>
              <p>Every contribution is human-reviewed and cryptographically linked to your on-chain identity.</p>
            </div>
            <div className={styles.bentoCard}>
              <div className={styles.bentoIcon}><Award size={36} /></div>
              <h3>Soulbound Intel</h3>
              <p>Build a non-transferable SBT reputation score that grows with your expertise in the ecosystem.</p>
            </div>
            <div className={`${styles.bentoCard} ${styles.bentoWide}`}>
              <div className={styles.bentoIcon}><Globe size={36} /></div>
              <h3>Global Coordination Network</h3>
              <p>Archetypes acts as the single source of truth for developer and builder reputation across the entire Arc architecture. One profile, infinite opportunities.</p>
              <div className={styles.bentoGlow}></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS / TRUST ═══════════════════ */}
      <section className={styles.sectionDark}>
        <div className={styles.sectionInner}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>∞</div>
              <div className={styles.statLabel}>MISSIONS CAPACITY</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>SBT</div>
              <div className={styles.statLabel}>SOULBOUND TOKENS</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>100%</div>
              <div className={styles.statLabel}>HUMAN REVIEWED</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>ARC</div>
              <div className={styles.statLabel}>NATIVE NETWORK</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOR PROTOCOLS ═══════════════════ */}
      <section id="for-protocols" className={styles.sectionDark}>
        <div className={styles.sectionInner}>
          <div className={styles.protocolSection}>
            <div className={styles.protocolLeft}>
              <div className={styles.sectionLabel}>FOR PROTOCOLS</div>
              <h2 className={styles.sectionTitle}>ACTIVATE YOUR<br />BUILDER COMMUNITY</h2>
              <p className={styles.protocolDesc}>
                Launch targeted contribution campaigns, filter for quality with human review, 
                and build a verified network of contributors who actually understand your protocol.
              </p>
              <ul className={styles.protocolFeatures}>
                <li><span className={styles.featureDot}></span> Custom mission creation</li>
                <li><span className={styles.featureDot}></span> Manual review pipeline</li>
                <li><span className={styles.featureDot}></span> Contributor analytics</li>
                <li><span className={styles.featureDot}></span> On-chain attestations</li>
                <li><span className={styles.featureDot}></span> Anti-sybil filtering</li>
              </ul>
              <Link href="/protocols/apply" className={styles.ctaBtn}>
                <ArrowRight size={14} />
                APPLY TO LAUNCH
              </Link>
            </div>
            <div className={styles.protocolRight}>
              <div className={styles.terminalCard}>
                <div className={styles.terminalHeader}>
                  <span className={styles.terminalDot} style={{ background: '#ef4444' }}></span>
                  <span className={styles.terminalDot} style={{ background: '#f59e0b' }}></span>
                  <span className={styles.terminalDot} style={{ background: '#10b981' }}></span>
                  <span className={styles.terminalTitle}>archetypes.protocol</span>
                </div>
                <div className={styles.terminalBody}>
                  <div className={styles.terminalLine}><span className={styles.terminalPrompt}>$</span> create-mission --type QA</div>
                  <div className={styles.terminalLine}><span className={styles.terminalPrompt}>→</span> Mission created. ID: <span className={styles.terminalAccent}>0x8f2a...</span></div>
                  <div className={styles.terminalLine}><span className={styles.terminalPrompt}>$</span> set-reward --rep 50 --sbt true</div>
                  <div className={styles.terminalLine}><span className={styles.terminalPrompt}>→</span> Reward configured: <span className={styles.terminalAccent}>+50 REP + SBT Badge</span></div>
                  <div className={styles.terminalLine}><span className={styles.terminalPrompt}>$</span> publish --network arc-testnet</div>
                  <div className={styles.terminalLine}><span className={styles.terminalPrompt}>✓</span> <span className={styles.terminalSuccess}>Mission live. Awaiting contributions.</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section id="cta" className={styles.ctaSection}>
        <div className={styles.sectionInner}>
          <div className={styles.ctaContent}>
            <div className={styles.sectionLabel}>GET STARTED</div>
            <h2 className={styles.ctaTitle}>READY TO BUILD<br />YOUR REPUTATION?</h2>
            <p className={styles.ctaSub}>
              Join the next generation of coordinated builders on Arc.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/missions" className={styles.ctaBtnPrimary}>
                START CONTRIBUTING
                <ArrowRight size={16} />
              </Link>
              <Link href="/protocols/apply" className={styles.ctaBtn}>
                FOR PROTOCOLS
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomLeft}>
          <span className={styles.statusDot}></span>
          ARC TESTNET
        </div>
        <div className={styles.bottomCenter}>© 2025 Archetypes</div>
        <div className={styles.bottomRight}>
          <Link href="/protocols/apply" className={styles.bottomLink}>LAUNCH PROTOCOL</Link>
        </div>
      </div>
    </div>
  )
}
