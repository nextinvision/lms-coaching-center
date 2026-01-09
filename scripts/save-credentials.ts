#!/usr/bin/env tsx
/**
 * Save Old Credentials
 * 
 * This script saves your old Supabase and Cloudinary credentials to a secure file
 * Run with: tsx scripts/save-credentials.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const BACKUP_DIR = path.join(process.cwd(), 'backups');
const CREDENTIALS_FILE = path.join(BACKUP_DIR, 'old-credentials.json.encrypted');

// Simple encryption (in production, use more secure methods)
function encrypt(text: string, key: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.padEnd(32).slice(0, 32)), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Old credentials from the user
const oldCredentials = {
    database: {
        url: "postgresql://postgres.pzeofossaxrhjzbomofr:Lms123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
        directUrl: "postgresql://postgres.pzeofossaxrhjzbomofr:Lms123@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
    },
    supabase: {
        url: "https://pzeofossaxrhjzbomofr.supabase.co",
        anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZW9mb3NzYXhyaGp6Ym9tb2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxODE1NzMsImV4cCI6MjA4MTc1NzU3M30.H3BRmBrk8tbBPh7rGhwM3pP1rJPw7fbQPr1pwRSqgkw",
        serviceRoleKey: "your-service-role-key-here"
    },
    cloudinary: {
        cloudName: "dbsdjfeby",
        apiKey: "451429197878122",
        apiSecret: "HHje4yAyBJZ8sDlh363Sde_8MUk",
        url: "cloudinary://451429197878122:HHje4yAyBJZ8sDlh363Sde_8MUk@dbsdjfeby"
    },
    timestamp: new Date().toISOString()
};

async function main() {
    // Create backup directory
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Save as plain JSON (for easy access) - consider encrypting in production
    const plainFile = path.join(BACKUP_DIR, 'old-credentials.json');
    fs.writeFileSync(plainFile, JSON.stringify(oldCredentials, null, 2));
    
    console.log('✓ Old credentials saved!');
    console.log(`📁 Location: ${plainFile}`);
    console.log('\n⚠️  WARNING: This file contains sensitive credentials.');
    console.log('   Keep it secure and do not commit to version control.');
    console.log('   Consider deleting it after migration is complete.\n');
    
    // Also create a .env.backup file for easy sourcing
    const envBackupFile = path.join(BACKUP_DIR, '.env.backup');
    const envContent = `# Old Credentials Backup
# Generated on: ${oldCredentials.timestamp}
# DO NOT COMMIT THIS FILE

# Database - Supabase PostgreSQL
OLD_DATABASE_URL="${oldCredentials.database.url}"
OLD_DIRECT_URL="${oldCredentials.database.directUrl}"

# Supabase
OLD_SUPABASE_URL="${oldCredentials.supabase.url}"
OLD_SUPABASE_ANON_KEY="${oldCredentials.supabase.anonKey}"
OLD_SUPABASE_SERVICE_ROLE_KEY="${oldCredentials.supabase.serviceRoleKey}"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="${oldCredentials.cloudinary.cloudName}"
CLOUDINARY_API_KEY="${oldCredentials.cloudinary.apiKey}"
CLOUDINARY_API_SECRET="${oldCredentials.cloudinary.apiSecret}"
CLOUDINARY_URL="${oldCredentials.cloudinary.url}"
`;
    
    fs.writeFileSync(envBackupFile, envContent);
    console.log(`📁 Environment backup: ${envBackupFile}`);
    console.log('   You can source this file: source backups/.env.backup\n');
}

main();

