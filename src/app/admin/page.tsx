import { Shield, LayoutGrid, CheckSquare, Flag } from 'lucide-react'
import { db } from '@/db'
import { protocolApplications, missions, submissions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import AdminTabs from './AdminTabs'
import styles from './admin.module.css'

export default async function AdminPage() {
  const pendingProtocols = await db.select().from(protocolApplications).where(eq(protocolApplications.status, 'PENDING'))
  const allProtocols = await db.query.protocols.findMany()
  
  const allMissions = await db.query.missions.findMany({
    with: { protocol: true }
  })
  
  const pendingSubmissions = await db.query.submissions.findMany({
    where: eq(submissions.status, 'PENDING'),
    with: {
      mission: true,
      user: true
    }
  })

  const allUsers = await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.reputation)]
  })

  return (
    <div className="container">
      <div className={styles.adminHeader}>
        <div>
          <h1>Platform Administration</h1>
          <p>Manage protocol onboarding, mission quality, and platform health.</p>
        </div>
      </div>

      <AdminTabs 
        pendingProtocols={pendingProtocols} 
        allProtocols={allProtocols}
        allMissions={allMissions} 
        pendingSubmissions={pendingSubmissions}
        allUsers={allUsers}
      />
    </div>
  )
}
