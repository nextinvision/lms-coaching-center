// Export Performance Report API Route
import { NextResponse } from 'next/server';
import { reportService, exportService } from '@/modules/reports';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';

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

        const body = await request.json();
        const { filters, format } = body;

        const report = await reportService.getPerformanceReport(filters);

        // Flatten report data for export
        const flatData: any[] = [];
        report.forEach((batch) => {
            batch.students.forEach((student) => {
                flatData.push({
                    'Batch Name': batch.batchName,
                    'Student Name': student.studentName,
                    'Total Tests': student.totalTests,
                    'Average Marks': `${student.averageMarks.toFixed(2)}%`,
                    'Highest Marks': `${student.highestMarks.toFixed(2)}%`,
                    'Lowest Marks': `${student.lowestMarks.toFixed(2)}%`,
                });
            });
        });

        let content: string | Blob;
        let contentType: string;
        let filename: string;

        switch (format) {
            case 'CSV':
                content = await exportService.exportPerformanceToCSV(flatData);
                contentType = 'text/csv';
                filename = 'performance-report.csv';
                break;
            case 'PDF':
                content = await exportService.exportPerformanceToPDF(flatData);
                contentType = 'application/pdf';
                filename = 'performance-report.pdf';
                break;
            case 'EXCEL':
                content = await exportService.exportPerformanceToExcel(flatData);
                contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                filename = 'performance-report.xlsx';
                break;
            default:
                throw new Error('Unsupported export format');
        }

        return new NextResponse(content, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}

