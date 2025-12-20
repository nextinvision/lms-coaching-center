// Student Attendance Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { AttendanceChart, AttendanceCalendar, AttendanceReport } from '@/modules/attendance';
import { useAuth } from '@/modules/auth';
import { useStudent } from '@/modules/students';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/Tabs';

export default function StudentAttendancePage() {
    const { user } = useAuth();
    const studentId = user?.studentProfile?.id || null;
    const { student } = useStudent(studentId);
    const batchId = student?.batchId || null;

    if (!studentId) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="text-center py-12">
                        <p className="text-gray-600">Student profile not found</p>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
                        <p className="text-gray-600 mt-2">View your attendance records and statistics</p>
                    </div>

                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="calendar">Calendar</TabsTrigger>
                            <TabsTrigger value="report">Report</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <AttendanceChart studentId={studentId} batchId={batchId || undefined} />
                        </TabsContent>

                        <TabsContent value="calendar">
                            <AttendanceCalendar studentId={studentId} batchId={batchId || undefined} />
                        </TabsContent>

                        <TabsContent value="report">
                            <AttendanceReport studentId={studentId} batchId={batchId || undefined} />
                        </TabsContent>
                    </Tabs>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

