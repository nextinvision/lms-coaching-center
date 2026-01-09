#!/usr/bin/env tsx
/**
 * Backup Cloudinary Files
 * 
 * This script exports file metadata and downloads files from Cloudinary
 * Run with: tsx scripts/backup-cloudinary.ts
 */

import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

// Load Cloudinary credentials from environment or backup file
let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
let apiKey = process.env.CLOUDINARY_API_KEY;
let apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
    try {
        const credentialsPath = path.join(process.cwd(), 'backups', 'old-credentials.json');
        if (fs.existsSync(credentialsPath)) {
            const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
            cloudName = cloudName || credentials.cloudinary.cloudName;
            apiKey = apiKey || credentials.cloudinary.apiKey;
            apiSecret = apiSecret || credentials.cloudinary.apiSecret;
        }
    } catch (error) {
        console.warn('Could not load credentials from backup file');
    }
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: cloudName || 'dbsdjfeby',
    api_key: apiKey || '451429197878122',
    api_secret: apiSecret || 'HHje4yAyBJZ8sDlh363Sde_8MUk',
});

const BACKUP_DIR = path.join(process.cwd(), 'backups', 'cloudinary');
const FILES_DIR = path.join(BACKUP_DIR, 'files');

// Create backup directories
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}
if (!fs.existsSync(FILES_DIR)) {
    fs.mkdirSync(FILES_DIR, { recursive: true });
}

interface FileMetadata {
    public_id: string;
    secure_url: string;
    url: string;
    resource_type: string;
    format: string;
    bytes: number;
    width?: number;
    height?: number;
    created_at: string;
    folder?: string;
}

async function downloadFile(url: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(filePath);
        
        client.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                // Handle redirects
                return downloadFile(response.headers.location!, filePath).then(resolve).catch(reject);
            }
            
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlinkSync(filePath);
            reject(err);
        });
    });
}

async function backupCloudinaryFiles() {
    console.log('Fetching all resources from Cloudinary...\n');

    const allResources: FileMetadata[] = [];
    let nextCursor: string | undefined = undefined;

    do {
        try {
            const result: any = await cloudinary.search
                .expression('folder:lms/*')
                .max_results(500)
                .execute();
            
            // Handle pagination
            if (result.next_cursor) {
                nextCursor = result.next_cursor;
            } else {
                nextCursor = undefined;
            }

            if (result.resources) {
                allResources.push(...result.resources);
                console.log(`Fetched ${result.resources.length} resources (Total: ${allResources.length})`);
            }

            nextCursor = result.next_cursor;
        } catch (error) {
            console.error('Error fetching resources:', error);
            break;
        }
    } while (nextCursor);

    console.log(`\n✓ Found ${allResources.length} files in Cloudinary\n`);

    // Save metadata
    const metadataFile = path.join(BACKUP_DIR, `cloudinary-metadata-${Date.now()}.json`);
    fs.writeFileSync(metadataFile, JSON.stringify({
        timestamp: new Date().toISOString(),
        totalFiles: allResources.length,
        files: allResources,
    }, null, 2));

    console.log(`✓ Metadata saved to: ${metadataFile}\n`);

    // Download files (optional - can be large)
    console.log('Downloading files (this may take a while)...\n');
    
    let downloaded = 0;
    let failed = 0;

    for (const resource of allResources) {
        try {
            const fileName = resource.public_id.replace(/\//g, '_') + '.' + resource.format;
            const filePath = path.join(FILES_DIR, fileName);

            // Create subdirectory if needed
            const subDir = path.dirname(filePath);
            if (!fs.existsSync(subDir)) {
                fs.mkdirSync(subDir, { recursive: true });
            }

            await downloadFile(resource.secure_url, filePath);
            downloaded++;
            
            if (downloaded % 10 === 0) {
                console.log(`Downloaded ${downloaded}/${allResources.length} files...`);
            }
        } catch (error) {
            console.error(`Failed to download ${resource.public_id}:`, error);
            failed++;
        }
    }

    console.log(`\n✓ Download completed!`);
    console.log(`  - Downloaded: ${downloaded}`);
    console.log(`  - Failed: ${failed}`);
    console.log(`  - Files saved to: ${FILES_DIR}`);

    return metadataFile;
}

async function main() {
    try {
        const metadataFile = await backupCloudinaryFiles();
        
        console.log('\n✅ Cloudinary backup completed successfully!');
        console.log(`📦 Metadata file: ${metadataFile}`);
        console.log(`📁 Files directory: ${FILES_DIR}`);
        
    } catch (error) {
        console.error('❌ Backup failed:', error);
        process.exit(1);
    }
}

main();

