import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const address = formData.get('address') as string

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filename = `${address.toLowerCase()}-${Date.now()}.${file.name.split('.').pop()}`
    const path = join(process.cwd(), 'public/avatars', filename)
    
    await writeFile(path, buffer)
    const avatarUrl = `/avatars/${filename}`

    // Update user in DB
    await db.update(users)
      .set({ avatarUrl })
      .where(eq(users.address, address.toLowerCase()))

    return NextResponse.json({ success: true, url: avatarUrl })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
