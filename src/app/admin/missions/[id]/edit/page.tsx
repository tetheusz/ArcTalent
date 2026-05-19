import { db } from '@/db'
import { missions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import styles from './edit-mission.module.css'
import EditMissionForm from './EditMissionForm'

export default async function EditMissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const mission = await db.query.missions.findFirst({
    where: eq(missions.id, id),
    with: { protocol: true }
  })

  if (!mission) notFound()

  return (
    <div className="container">
      <Link href="/admin" className={styles.backLink}>
        <ArrowLeft size={16} />
        Back to Admin
      </Link>

      <div className={styles.header}>
        <h1>Edit Mission</h1>
        <p>Updating mission details for <strong>{mission.protocol.name}</strong></p>
      </div>

      <div className={`${styles.formCard} glass-panel`}>
        <EditMissionForm mission={mission} />
      </div>
    </div>
  )
}
