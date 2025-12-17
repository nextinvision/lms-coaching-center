import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

export async function getCurrentUser() {
  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  if (!user) return null

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      studentProfile: {
        include: {
          batch: true,
        },
      },
      teacherProfile: true,
      adminProfile: true,
    },
  })

  return dbUser
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(role: UserRole) {
  const user = await requireAuth()
  if (user.role !== role) {
    throw new Error('Forbidden: Insufficient permissions')
  }
  return user
}

export async function requireAdmin() {
  return requireRole('ADMIN')
}

export async function requireTeacher() {
  return requireRole('TEACHER')
}

export async function requireStudent() {
  return requireRole('STUDENT')
}

