import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.logo}>
              <img src="/logo.png" alt="Archetypes Logo" style={{ width: '24px', height: '24px' }} />
              <span>Archetypes</span>
            </div>
            <p>The reputation operating system for the Arc ecosystem.</p>
          </div>
          
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4>Platform</h4>
              <Link href="/missions">Missions</Link>
              <Link href="/protocols">Protocols</Link>
              <Link href="/leaderboard">Leaderboard</Link>
            </div>
            <div className={styles.linkGroup}>
              <h4>Ecosystem</h4>
              <Link href="https://arc.io" target="_blank">Arc Protocol</Link>
              <Link href="https://arc.house" target="_blank">Arc House</Link>
              <Link href="https://docs.arc.io" target="_blank">Documentation</Link>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <span>© 2025 Archetypes. Built for the Arc Testnet.</span>
          <div className={styles.socials}>
            <Link href="https://twitter.com" target="_blank">Twitter</Link>
            <Link href="https://discord.com" target="_blank">Discord</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
