// Legacy auth utilities - now using modular auth service
// This file provides backward compatibility for existing code
import { cookies } from 'next/headers'
import { UserRole } from '@prisma/client'
import { authService } from '@/modules/auth/services/authService'
import type { AuthUser as ModularAuthUser } from '@/modules/auth/types/auth.types'

// Re-export AuthUser type for backward compatibility
export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  imageUrl?: string | null
}

// Convert modular AuthUser to legacy format
function toLegacyAuthUser(user: ModularAuthUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    imageUrl: user.imageUrl,
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    // Support both cookie names for backward compatibility
    const token = cookieStore.get('auth_token')?.value || cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const user = await authService.getCurrentUser(token)
    if (!user) {
      return null
    }

    return toLegacyAuthUser(user)
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(role: UserRole): Promise<AuthUser> {
  const user = await requireAuth()
  if (user.role !== role) {
    throw new Error('Forbidden: Insufficient permissions')
  }
  return user
}

export async function requireAdmin(): Promise<AuthUser> {
  return requireRole('ADMIN')
}

export async function requireTeacher(): Promise<AuthUser> {
  return requireRole('TEACHER')
}

export async function requireStudent(): Promise<AuthUser> {
  return requireRole('STUDENT')
}

// Legacy token creation - using JWT_SECRET for backward compatibility
// Note: New code should use authService.login() instead
import jwt from 'jsonwebtoken'

// JWT_SECRET is required for security - no fallbacks allowed
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required. Please set it in your .env file.');
  }
  // TypeScript assertion: secret is guaranteed to be string after the check above
  return secret as string;
}

export function createToken(userId: string): string {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, getJwtSecret()) as { userId: string }
  } catch {
    return null
  }
}
