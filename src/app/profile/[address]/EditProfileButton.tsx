'use client'

import { useState } from 'react'
import { Settings, User, X, Camera } from 'lucide-react'
import { useAccount } from 'wagmi'
import { updateUserProfile } from '@/actions/users'
import styles from './profile.module.css'

interface EditProfileButtonProps {
  address: string
  initialData: {
    name: string
    bio: string
    avatarUrl: string
    skills: string
  }
}

export default function EditProfileButton({ address, initialData }: EditProfileButtonProps) {
  const { address: currentAddress } = useAccount()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Only show edit button if user owns the profile
  if (currentAddress?.toLowerCase() !== address.toLowerCase()) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      bio: formData.get('bio') as string,
      avatarUrl: formData.get('avatarUrl') as string,
      skills: formData.get('skills') as string,
    }

    const res = await updateUserProfile(address, data)
    
    if (res.success) {
      setIsOpen(false)
      window.location.reload()
    } else {
      alert(res.error)
    }
    setLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn-secondary" 
        style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
      >
        <Settings size={16} />
        Edit Profile
      </button>

      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass-panel`}>
            <div className={styles.modalHeader}>
              <h2>Edit Profile</h2>
              <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.editForm}>
              <div className={styles.inputGroup}>
                <label>Profile Picture URL</label>
                <div className={styles.avatarInputWrapper}>
                  <input 
                    name="avatarUrl" 
                    defaultValue={initialData.avatarUrl} 
                    placeholder="https://example.com/photo.jpg" 
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Nickname / Display Name</label>
                <input name="name" defaultValue={initialData.name} placeholder="Your name" />
              </div>

              <div className={styles.inputGroup}>
                <label>Bio / Description</label>
                <textarea 
                  name="bio" 
                  defaultValue={initialData.bio} 
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Skills / Specializations (Comma separated)</label>
                <input 
                  name="skills" 
                  defaultValue={initialData.skills} 
                  placeholder="Solidity, React, Design..." 
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
