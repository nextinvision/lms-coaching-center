// PDF Upload API Route
import { NextResponse } from 'next/server';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
import { supabaseStorage } from '@/core/storage/supabase';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await authService.getCurrentUser(token);
        if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const batchId = formData.get('batchId') as string;
        const subjectId = formData.get('subjectId') as string | null;
        const chapter = formData.get('chapter') as string | null;

        if (!file || !batchId) {
            return NextResponse.json(
                { success: false, error: 'File and batchId are required' },
                { status: 400 }
            );
        }

        // Validate file type
        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { success: false, error: 'Only PDF files are allowed' },
                { status: 400 }
            );
        }

        // Generate file path
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        let path = `batch-${batchId}/`;
        if (subjectId) path += `subject-${subjectId}/`;
        if (chapter) path += `chapter-${chapter}/`;
        path += fileName;

        // Upload to Supabase
        const { url, path: filePath } = await supabaseStorage.uploadPDF(file, path);

        return NextResponse.json({
            success: true,
            data: {
                url,
                path: filePath,
                fileName: file.name,
                fileSize: file.size,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}

