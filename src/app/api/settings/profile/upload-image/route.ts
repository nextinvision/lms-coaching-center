// Profile Image Upload API Route
import { NextResponse } from 'next/server';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
import { minioStorage } from '@/core/storage/minio';

export async function POST(request: Request) {
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

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'File is required' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { success: false, error: 'Only image files are allowed' },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB for profile images)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, error: 'File size exceeds 5MB limit' },
                { status: 400 }
            );
        }

        // Upload to MinIO in profiles folder with user ID
        const folder = `profiles/user-${user.id}`;
        const { url, path, thumbnailUrl } = await minioStorage.uploadImage(file, folder);

        return NextResponse.json({
            success: true,
            data: {
                url,
                publicId: path, // Using path as publicId for backward compatibility
                thumbnailUrl: thumbnailUrl || url,
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

