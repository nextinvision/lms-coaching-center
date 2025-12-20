// Attendance Sheet Component
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { Input } from '@/shared/components/ui/Input';
import { useToast } from '@/shared/components/ui/Toast';
import { Loader } from '@/shared/components/ui/Loader';
import { useStudents } from '@/modules/students';
import { Calendar } from 'lucide-react';
import { markAttendanceSchema } from '../services/attendanceValidation';
import { useAuth } from '@/modules/auth';

interface AttendanceSheetProps {
    batchId: string;
    date?: Date;
    onSuccess?: () => void;
}

export function AttendanceSheet({ batchId, date = new Date(), onSuccess }: AttendanceSheetProps) {
    const [selectedDate, setSelectedDate] = useState(
        date.toISOString().split('T')[0]
    );
    const [attendance, setAttendance] = useState<Record<string, { present: boolean; remarks?: string }>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();
    const { user } = useAuth();
    const { students, isLoading } = useStudents({ batchId });

    useEffect(() => {
        // Load existing attendance for the date
        fetchExistingAttendance();
    }, [batchId, selectedDate]);

    const fetchExistingAttendance = async () => {
        try {
            const response = await fetch(
                `/api/attendance/batch/${batchId}?date=${selectedDate}`
            );
            if (response.ok) {
                const result = await response.json();
                const existing: Record<string, { present: boolean; remarks?: string }> = {};
                result.data.forEach((att: any) => {
                    existing[att.studentId] = {
                        present: att.present,
                        remarks: att.remarks || '',
                    };
                });
                setAttendance(existing);
            }
        } catch (error) {
            // No existing attendance, that's fine
        }
    };

    const handleToggleAttendance = (studentId: string, present: boolean) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                present,
            },
        }));
    };

    const handleBulkMark = (present: boolean) => {
        const newAttendance: Record<string, { present: boolean }> = {};
        students.forEach((student) => {
            newAttendance[student.id] = { present };
        });
        setAttendance(newAttendance);
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const attendanceData = students.map((student) => ({
                studentId: student.id,
                present: attendance[student.id]?.present || false,
                remarks: attendance[student.id]?.remarks || null,
            }));

            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    batchId,
                    date: new Date(selectedDate).toISOString(),
                    attendance: attendanceData,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save attendance');
            }

            showToast({
                message: 'Attendance saved successfully',
                variant: 'success',
            });

            onSuccess?.();
        } catch (error) {
            showToast({
                message: (error as Error).message,
                variant: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading students..." />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Mark Attendance</CardTitle>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-auto"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkMark(true)}
                    >
                        Mark All Present
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkMark(false)}
                    >
                        Mark All Absent
                    </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium">Student</th>
                                <th className="px-4 py-2 text-center text-sm font-medium">Present</th>
                                <th className="px-4 py-2 text-center text-sm font-medium">Absent</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium">{student.name}</p>
                                            <p className="text-xs text-gray-500">{student.user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Checkbox
                                            checked={attendance[student.id]?.present === true}
                                            onChange={(e) =>
                                                handleToggleAttendance(student.id, e.target.checked)
                                            }
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Checkbox
                                            checked={attendance[student.id]?.present === false}
                                            onChange={(e) =>
                                                handleToggleAttendance(student.id, !e.target.checked)
                                            }
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Input
                                            value={attendance[student.id]?.remarks || ''}
                                            onChange={(e) =>
                                                setAttendance((prev) => ({
                                                    ...prev,
                                                    [student.id]: {
                                                        ...prev[student.id],
                                                        present: prev[student.id]?.present ?? true,
                                                        remarks: e.target.value,
                                                    },
                                                }))
                                            }
                                            placeholder="Optional remarks"
                                            className="w-full"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        Save Attendance
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default AttendanceSheet;

