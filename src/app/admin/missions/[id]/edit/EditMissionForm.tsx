'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, AlertCircle } from 'lucide-react'
import { updateMission } from '@/actions/missions'
import styles from './edit-mission.module.css'

export default function EditMissionForm({ mission }: { mission: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: mission.title,
    description: mission.description,
    requirements: mission.requirements,
    reputationReward: mission.reputationReward.toString(),
    difficulty: mission.difficulty,
    category: mission.category,
    deadline: mission.deadline ? new Date(mission.deadline).toISOString().split('T')[0] : ''
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const res = await updateMission(mission.id, {
      ...formData,
      reputationReward: parseInt(formData.reputationReward),
      deadline: formData.deadline ? new Date(formData.deadline) : null
    })

    if (res.success) {
      router.push('/admin')
      router.refresh()
    } else {
      alert(res.error)
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label>Mission Title</label>
        <input 
          type="text" 
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>

      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <label>Category</label>
          <select 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="Developer">Developer</option>
            <option value="Sentinel">Sentinel</option>
            <option value="Creator">Creator</option>
            <option value="Scholar">Scholar</option>
            <option value="Architect">Architect</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label>Difficulty</label>
          <select 
            value={formData.difficulty}
            onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <label>Reputation Reward (Points)</label>
          <input 
            type="number" 
            value={formData.reputationReward}
            onChange={(e) => setFormData({...formData, reputationReward: e.target.value})}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Deadline (Optional)</label>
          <input 
            type="date" 
            value={formData.deadline}
            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label>Detailed Description</label>
        <textarea 
          rows={6}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Requirements (One per line)</label>
        <textarea 
          rows={4}
          value={formData.requirements}
          onChange={(e) => setFormData({...formData, requirements: e.target.value})}
          required
        />
      </div>

      <div className={styles.footer}>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
          <Save size={18} />
        </button>
      </div>
    </form>
  )
}
