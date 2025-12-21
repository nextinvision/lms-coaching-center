# JWT_SECRET Migration Guide

## What Happens When JWT_SECRET Changes?

When you change the `JWT_SECRET` in your `.env` file:

1. **All existing JWT tokens become invalid** - They were signed with the old secret
2. **Users are automatically logged out** - Token verification fails
3. **Old sessions remain in database** - They should be cleaned up

## Cleanup Steps

### Option 1: Using the Cleanup Script (Recommended)

```bash
npm run db:cleanup-sessions
```

This will delete all sessions from the database. Users will need to log in again.

### Option 2: Using Prisma Studio

1. Open Prisma Studio:
   ```bash
   npm run db:studio
   ```
2. Navigate to the `Session` model
3. Delete all sessions manually

### Option 3: Using SQL (Direct Database)

If you have direct database access:

```sql
-- Delete all sessions
DELETE FROM "Session";

-- Or delete only expired sessions (optional)
DELETE FROM "Session" WHERE "expiresAt" < NOW();
```

### Option 4: Using Prisma Client (Node.js)

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Delete all sessions
await prisma.session.deleteMany({});
```

## After Cleanup

1. **Restart your application** to ensure new JWT_SECRET is loaded
2. **Users will need to log in again** - All previous sessions are invalid
3. **New sessions will be created** with the new JWT_SECRET

## Important Notes

- ⚠️ **This will log out ALL users** - Make sure to notify users if this is a production system
- ✅ **No data loss** - Only session tokens are deleted, user accounts remain intact
- 🔒 **Security improvement** - Old tokens signed with weak/compromised secrets are invalidated
- 📝 **Optional cleanup** - Old sessions won't work anyway, but cleaning them up is good practice

## Verification

After cleanup, verify that:
1. Old tokens no longer work (users are logged out)
2. New logins create valid sessions
3. Token verification works correctly

