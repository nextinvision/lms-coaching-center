// Script to clean up all sessions after JWT_SECRET change
// Run this after updating JWT_SECRET in .env
// Usage: npx tsx scripts/cleanup-sessions.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupSessions() {
    try {
        console.log('🔄 Cleaning up all sessions...');
        
        const result = await prisma.session.deleteMany({});
        
        console.log(`✅ Successfully deleted ${result.count} session(s)`);
        console.log('📝 All users will need to log in again.');
    } catch (error) {
        console.error('❌ Error cleaning up sessions:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupSessions();

