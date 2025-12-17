import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new NextResponse('Error occurred', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    try {
      await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0].email_address,
          name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
          imageUrl: image_url,
          role: 'STUDENT', // Default role, admin can change later
        },
      })
    } catch (error) {
      console.error('Error creating user:', error)
      return new NextResponse('Error creating user', { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    try {
      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email: email_addresses[0].email_address,
          name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
          imageUrl: image_url,
        },
      })
    } catch (error) {
      console.error('Error updating user:', error)
      return new NextResponse('Error updating user', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    try {
      await prisma.user.delete({
        where: { clerkId: id },
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      return new NextResponse('Error deleting user', { status: 500 })
    }
  }

  return new NextResponse('', { status: 200 })
}

