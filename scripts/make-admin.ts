import { db } from '../src/db'
import { users } from '../src/db/schema'
import { eq } from 'drizzle-orm'

async function main() {
  const address = process.argv[2]
  if (!address) {
    console.error('Please provide a wallet address: npx tsx scripts/make-admin.ts <address>')
    process.exit(1)
  }

  console.log(`Promoting ${address} to ADMIN...`)

  // Ensure user exists first
  await db.insert(users).values({
    id: address.toLowerCase(),
    address: address.toLowerCase(),
    role: 'ADMIN'
  }).onConflictDoUpdate({
    target: users.address,
    set: { role: 'ADMIN' }
  })

  console.log('Done! You should now have access to /admin.')
}

main()
