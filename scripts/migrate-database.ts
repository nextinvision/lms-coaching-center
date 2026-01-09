#!/usr/bin/env tsx
/**
 * Migrate Database from Backup to Local PostgreSQL
 * 
 * This script imports data from backup JSON files to local PostgreSQL
 * Run with: tsx scripts/migrate-database.ts <backup-file.json>
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface BackupData {
    timestamp: string;
    tables: {
        [key: string]: any[];
    };
}

// Mapping of old data structure to new if needed
async function migrateTable(tableName: string, data: any[]) {
    console.log(`Migrating ${tableName}...`);
    
    if (data.length === 0) {
        console.log(`  ⏭️  Skipping ${tableName} (no data)`);
        return;
    }

    try {
        switch (tableName) {
            case 'User':
                await prisma.user.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        name: item.name,
                        email: item.email,
                        password: item.password,
                        phone: item.phone || null,
                        imageUrl: item.imageUrl || null,
                        role: item.role,
                        preferredLanguage: item.preferredLanguage || 'EN',
                        isActive: item.isActive !== false,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt || item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'Student':
                await prisma.student.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        userId: item.userId,
                        name: item.name,
                        phone: item.phone,
                        batchId: item.batchId || null,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt || item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'Teacher':
                await prisma.teacher.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        userId: item.userId,
                        name: item.name,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt || item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'Admin':
                await prisma.admin.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        userId: item.userId,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt || item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'AcademicYear':
                await prisma.academicYear.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        year: item.year,
                        startDate: new Date(item.startDate),
                        endDate: new Date(item.endDate),
                        isActive: item.isActive !== false,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt || item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'Batch':
                await prisma.batch.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        name: item.name,
                        academicYearId: item.academicYearId,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt || item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'Subject':
                await prisma.subject.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        name: item.name,
                        batchId: item.batchId,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt || item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'BatchTeacher':
                await prisma.batchTeacher.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        batchId: item.batchId,
                        teacherId: item.teacherId,
                        createdAt: new Date(item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'Content':
                await prisma.content.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        title: item.title,
                        description: item.description || null,
                        type: item.type,
                        fileUrl: item.fileUrl, // Will be updated later with MinIO URLs
                        fileSize: item.fileSize || null,
                        fileName: item.fileName || null,
                        batchId: item.batchId,
                        subjectId: item.subjectId || null,
                        chapterName: item.chapterName || null,
                        language: item.language || 'EN',
                        isDownloadable: item.isDownloadable !== false,
                        uploadedById: item.uploadedById,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt || item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'Attendance':
                await prisma.attendance.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        studentId: item.studentId,
                        batchId: item.batchId,
                        date: new Date(item.date),
                        present: item.present !== false,
                        remarks: item.remarks || null,
                        markedById: item.markedById,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt || item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'Test':
                await prisma.test.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        title: item.title,
                        description: item.description || null,
                        type: item.type,
                        batchId: item.batchId,
                        subjectId: item.subjectId || null,
                        durationMinutes: item.durationMinutes || null,
                        totalMarks: item.totalMarks,
                        createdById: item.createdById,
                        isActive: item.isActive !== false,
                        startDate: item.startDate ? new Date(item.startDate) : null,
                        endDate: item.endDate ? new Date(item.endDate) : null,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt || item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'Question':
                await prisma.question.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        testId: item.testId,
                        questionText: item.questionText,
                        questionTextAssamese: item.questionTextAssamese || null,
                        type: item.type,
                        options: item.options || null,
                        correctAnswer: item.correctAnswer || null,
                        marks: item.marks || 1,
                        order: item.order,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt || item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'TestSubmission':
                await prisma.testSubmission.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        testId: item.testId,
                        studentId: item.studentId,
                        submittedAt: new Date(item.submittedAt),
                        totalMarks: item.totalMarks,
                        obtainedMarks: item.obtainedMarks,
                        timeSpent: item.timeSpent || null,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt || item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'Answer':
                await prisma.answer.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        submissionId: item.submissionId,
                        questionId: item.questionId,
                        answerText: item.answerText || null,
                        selectedOption: item.selectedOption || null,
                        isCorrect: item.isCorrect || null,
                        marksObtained: item.marksObtained || 0,
                        createdAt: new Date(item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'Assignment':
                await prisma.assignment.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        title: item.title,
                        description: item.description || null,
                        batchId: item.batchId,
                        subjectId: item.subjectId || null,
                        fileUrl: item.fileUrl || null,
                        dueDate: item.dueDate ? new Date(item.dueDate) : null,
                        createdById: item.createdById,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt || item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'AssignmentSubmission':
                await prisma.assignmentSubmission.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        assignmentId: item.assignmentId,
                        studentId: item.studentId,
                        fileUrl: item.fileUrl || null,
                        submittedAt: new Date(item.submittedAt),
                        isChecked: item.isChecked || false,
                        marks: item.marks || null,
                        remarks: item.remarks || null,
                        checkedById: item.checkedById || null,
                        checkedAt: item.checkedAt ? new Date(item.checkedAt) : null,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt || item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'Notice':
                await prisma.notice.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        title: item.title,
                        content: item.content,
                        contentAssamese: item.contentAssamese || null,
                        type: item.type || 'GENERAL',
                        batchId: item.batchId || null,
                        isActive: item.isActive !== false,
                        priority: item.priority || 0,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt || item.createdAt),
                        expiresAt: item.expiresAt ? new Date(item.expiresAt) : null,
                    })),
                    skipDuplicates: true,
                });
                break;

            case 'Session':
                await prisma.session.createMany({
                    data: data.map(item => ({
                        id: item.id,
                        userId: item.userId,
                        token: item.token,
                        expiresAt: new Date(item.expiresAt),
                        createdAt: new Date(item.createdAt),
                    })),
                    skipDuplicates: true,
                });
                break;

            default:
                console.log(`  ⚠️  Unknown table: ${tableName}`);
                return;
        }

        console.log(`  ✓ Migrated ${data.length} records`);
    } catch (error) {
        console.error(`  ❌ Error migrating ${tableName}:`, error);
        throw error;
    }
}

async function migrateDatabase(backupFile: string) {
    console.log(`Loading backup from: ${backupFile}\n`);
    
    if (!fs.existsSync(backupFile)) {
        throw new Error(`Backup file not found: ${backupFile}`);
    }

    const backupData: BackupData = JSON.parse(fs.readFileSync(backupFile, 'utf-8'));
    
    console.log(`Backup timestamp: ${backupData.timestamp}`);
    console.log(`Tables to migrate: ${Object.keys(backupData.tables).length}\n`);

    // Migrate in order (respecting foreign key constraints)
    const migrationOrder = [
        'User',
        'AcademicYear',
        'Batch',
        'Subject',
        'Teacher',
        'Student',
        'Admin',
        'BatchTeacher',
        'Content',
        'Attendance',
        'Test',
        'Question',
        'TestSubmission',
        'Answer',
        'Assignment',
        'AssignmentSubmission',
        'Notice',
        'Session',
    ];

    for (const tableName of migrationOrder) {
        if (backupData.tables[tableName]) {
            await migrateTable(tableName, backupData.tables[tableName]);
        }
    }

    console.log('\n✅ Database migration completed!');
    console.log('⚠️  Note: File URLs in Content and Assignment tables may still point to old storage.');
    console.log('   Run the file migration script to update URLs to MinIO if needed.');
}

async function main() {
    const backupFile = process.argv[2];

    if (!backupFile) {
        console.error('Usage: tsx scripts/migrate-database.ts <backup-file.json>');
        console.error('Example: tsx scripts/migrate-database.ts backups/backup-1234567890.json');
        process.exit(1);
    }

    try {
        console.log('Connecting to local PostgreSQL...');
        await prisma.$connect();
        console.log('Connected!\n');

        await migrateDatabase(backupFile);
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();

