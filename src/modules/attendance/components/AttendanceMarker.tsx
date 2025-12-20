// Attendance Marker Component (Simplified version)
'use client';

import React from 'react';
import { AttendanceSheet } from './AttendanceSheet';

interface AttendanceMarkerProps {
    batchId: string;
    date?: Date;
    onSuccess?: () => void;
}

export function AttendanceMarker({ batchId, date, onSuccess }: AttendanceMarkerProps) {
    return <AttendanceSheet batchId={batchId} date={date} onSuccess={onSuccess} />;
}

export default AttendanceMarker;

