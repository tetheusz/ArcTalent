import { NextResponse } from 'next/server'
import { db } from '@/db'
import { submissions } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const results = await db.query.submissions.findMany({
      where: eq(submissions.status, 'PENDING'),
      with: {
        mission: true,
        user: true
      },
      orderBy: (submissions, { desc }) => [desc(submissions.createdAt)]
    })
    
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error fetching pending submissions:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
