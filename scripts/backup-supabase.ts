#!/usr/bin/env tsx
/**
 * Backup Supabase Database
 * 
 * This script exports data from Supabase to JSON files
 * Run with: tsx scripts/backup-supabase.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Load old Supabase connection from environment or backup file
let OLD_DATABASE_URL = process.env.OLD_DATABASE_URL;

if (!OLD_DATABASE_URL) {
    try {
        const credentialsPath = path.join(process.cwd(), 'backups', 'old-credentials.json');
        if (fs.existsSync(credentialsPath)) {
            const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
            OLD_DATABASE_URL = credentials.database.url;
        }
    } catch (error) {
        console.warn('Could not load credentials from backup file');
    }
}

OLD_DATABASE_URL = OLD_DATABASE_URL || 
    "postgresql://postgres.pzeofossaxrhjzbomofr:Lms123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: OLD_DATABASE_URL,
        },
    },
});

interface BackupData {
    timestamp: string;
    tables: {
        [key: string]: any[];
    };
}

async function backupTable(tableName: string): Promise<any[]> {
    console.log(`Backing up ${tableName}...`);
    
    try {
        // Use Prisma's raw query for flexibility
        const result = await prisma.$queryRawUnsafe(`SELECT * FROM "${tableName}"`);
        return result as any[];
    } catch (error) {
        console.error(`Error backing up ${tableName}:`, error);
        // Try without quotes for some tables
        try {
            const result = await prisma.$queryRawUnsafe(`SELECT * FROM ${tableName}`);
            return result as any[];
        } catch (e) {
            console.error(`Failed to backup ${tableName} with both methods`);
            return [];
        }
    }
}

async function backupAllTables() {
    const backupData: BackupData = {
        timestamp: new Date().toISOString(),
        tables: {},
    };

    // List of all tables in the schema
    const tables = [
        'User',
        'Student',
        'Teacher',
        'Admin',
        'AcademicYear',
        'Batch',
        'Subject',
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

    console.log('Starting database backup...\n');

    for (const table of tables) {
        const data = await backupTable(table);
        backupData.tables[table] = data;
        console.log(`✓ Backed up ${table}: ${data.length} records`);
    }

    // Save to JSON file
    const backupFile = path.join(BACKUP_DIR, `backup-${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    
    console.log(`\n✓ Backup completed!`);
    console.log(`✓ Backup saved to: ${backupFile}`);
    
    // Also save summary
    const summary = {
        timestamp: backupData.timestamp,
        tables: Object.entries(backupData.tables).map(([name, data]) => ({
            name,
            recordCount: data.length,
        })),
    };
    
    const summaryFile = path.join(BACKUP_DIR, `backup-summary-${Date.now()}.json`);
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`✓ Summary saved to: ${summaryFile}`);

    return backupFile;
}

async function main() {
    try {
        console.log('Connecting to Supabase database...');
        await prisma.$connect();
        console.log('Connected!\n');

        const backupFile = await backupAllTables();
        
        console.log('\n✅ Backup process completed successfully!');
        console.log(`📦 Backup file: ${backupFile}`);
        
    } catch (error) {
        console.error('❌ Backup failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();

