// Notices API Route
import { NextResponse } from 'next/server';
import { noticeService, createNoticeSchema } from '@/modules/notices';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { parsePaginationQuery } from '@/shared/utils/pagination';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await authService.getCurrentUser(token);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const batchId = searchParams.get('batchId') || undefined;
        const type = searchParams.get('type') || undefined;
        const isActive = searchParams.get('isActive');
        const search = searchParams.get('search') || undefined;

        // Parse pagination
        const pagination = parsePaginationQuery({
            page: searchParams.get('page') || undefined,
            limit: searchParams.get('limit') || undefined,
        });

        const result = await noticeService.getAll(
            {
                batchId: batchId === '' ? undefined : batchId,
                type: type as any,
                isActive: isActive !== null ? isActive === 'true' : undefined,
                search,
            },
            pagination
        );

        return NextResponse.json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await authService.getCurrentUser(token);
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const validatedData = createNoticeSchema.parse(body);
        
        // Convert type string to NoticeType enum
        // expiresAt is already converted to ISO format by the schema transform
        const data = {
            ...validatedData,
            type: validatedData.type as any,
            expiresAt: validatedData.expiresAt || null,
        };

        const notice = await noticeService.create(data);

        return NextResponse.json({
            success: true,
            data: notice,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: error.issues[0]?.message || 'Validation error' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}

