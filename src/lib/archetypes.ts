import { Code, Shield, Sparkles, BookOpen, Globe } from 'lucide-react'

export type ArchetypeClass = 'Developer' | 'Sentinel' | 'Creator' | 'Scholar' | 'Architect'

export interface ArchetypeConfig {
  name: ArchetypeClass
  category: string
  icon: any
  color: string
  glow: string
}

export const ARCHETYPES_CONFIG: Record<string, ArchetypeConfig> = {
  Developer: {
    name: 'Developer',
    category: 'TECHNICAL',
    icon: Code,
    color: '#00E5FF',
    glow: 'rgba(0, 229, 255, 0.4)'
  },
  Sentinel: {
    name: 'Sentinel',
    category: 'QA_TESTING',
    icon: Shield,
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.4)'
  },
  Creator: {
    name: 'Creator',
    category: 'CONTENT_CREATION',
    icon: Sparkles,
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)'
  },
  Scholar: {
    name: 'Scholar',
    category: 'RESEARCH',
    icon: BookOpen,
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.4)'
  },
  Architect: {
    name: 'Architect',
    category: 'PROTOCOL',
    icon: Globe,
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)'
  }
}

const LEVEL_THRESHOLDS = [0, 50, 150, 350, 700, 1200, 1950, 2950, 4450, 6450]

export function getArchetypeStats(submissions: any[]) {
  const stats: Record<ArchetypeClass, number> = {
    Developer: 0,
    Sentinel: 0,
    Creator: 0,
    Scholar: 0,
    Architect: 0
  }

  submissions.forEach(sub => {
    if (sub.status === 'APPROVED') {
      const category = sub.mission.category
      const config = ARCHETYPES_CONFIG[category]
      if (config) {
        stats[config.name] += sub.rewardGranted ?? sub.mission.reputationReward
      }
    }
  })

  return stats
}

export function getPrimaryArchetype(stats: Record<ArchetypeClass, number>): ArchetypeClass {
  let maxXP = -1
  let primary: ArchetypeClass = 'Developer'

  for (const [name, xp] of Object.entries(stats)) {
    if (xp > maxXP) {
      maxXP = xp
      primary = name as ArchetypeClass
    }
  }

  return primary
}

export function getLevelInfo(totalXP: number) {
  let level = 1
  let nextThreshold = LEVEL_THRESHOLDS[1]
  let currentThreshold = 0

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      level = i + 1
      currentThreshold = LEVEL_THRESHOLDS[i]
      nextThreshold = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i] * 2 // Fallback for max level
    } else {
      break
    }
  }

  const progress = level >= LEVEL_THRESHOLDS.length 
    ? 100 
    : ((totalXP - currentThreshold) / (nextThreshold - currentThreshold)) * 100

  return {
    level,
    progress,
    currentThreshold,
    nextThreshold,
    isMax: level >= LEVEL_THRESHOLDS.length
  }
}
