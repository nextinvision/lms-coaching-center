// Teacher Content Viewer Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { FileViewer } from '@/modules/content';
import { useContent } from '@/modules/content';
import { Loader } from '@/shared/components/ui/Loader';
import { Button } from '@/shared/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TeacherContentViewerPage() {
    const params = useParams();
    const contentId = params.id as string;
    const { content, isLoading, error } = useContent(contentId);

    return (
        <ProtectedRoute requiredPermissions={['upload_content']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link href="/teacher/content">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Content
                            </Button>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader text="Loading content..." />
                        </div>
                    ) : error || !content ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">{error || 'Content not found'}</p>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-4">
                                <h1 className="text-2xl font-bold">{content.title}</h1>
                                {content.description && (
                                    <p className="text-gray-600 mt-2">{content.description}</p>
                                )}
                            </div>
                            <FileViewer content={content} />
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

