// Health Check API Route for Cloud Run
import { NextResponse } from 'next/server';
import prisma from '@/core/database/prisma';

export async function GET() {
    try {
        // Check database connection
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'connected',
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: (error as Error).message,
        }, { status: 503 });
    }
}
