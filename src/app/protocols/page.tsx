import { Shield, Search, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import styles from './protocols-list.module.css'
import { db } from '@/db'
import { protocols } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'

export default async function ProtocolsPage() {
  const verifiedProtocols = await db.select()
    .from(protocols)
    .where(eq(protocols.isVerified, true))
    .orderBy(asc(protocols.name))

  return (
    <div className="container">
      <div className={styles.header}>
        <div>
          <h1>Verified Protocols</h1>
          <p>Join the best teams in the Arc ecosystem.</p>
        </div>
        <Link href="/protocols/apply" className="btn-primary">
          Register Protocol
        </Link>
      </div>

      <div className={styles.searchBar}>
        <Search size={20} className={styles.searchIcon} />
        <input type="text" placeholder="Search protocols..." />
      </div>

      {verifiedProtocols.length === 0 ? (
        <div className={styles.emptyState}>
          <Shield size={48} className={styles.emptyIcon} />
          <h3>No verified protocols yet</h3>
          <p>We are currently onboarding the first wave of protocols. Check back soon!</p>
          <Link href="/protocols/apply" className="btn-secondary">Apply to Join</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {verifiedProtocols.map((protocol) => (
            <Link key={protocol.id} href={`/protocols/${protocol.slug}`} className={`${styles.card} glass-panel`}>
              <div className={styles.cardMain}>
                <div className={styles.logoBox}>
                  {protocol.logoUrl ? (
                    <img src={protocol.logoUrl} alt={protocol.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    protocol.name.charAt(0)
                  )}
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.nameRow}>
                    <h3>{protocol.name}</h3>
                    <Shield size={16} color="var(--accent-primary)" />
                  </div>
                  <p>{protocol.description.substring(0, 100)}...</p>
                </div>
              </div>
              <div className={styles.cardAction}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 900 }}>EXPLORE MISSIONS</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
