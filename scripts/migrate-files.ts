#!/usr/bin/env tsx
/**
 * Migrate Files from Cloudinary to MinIO
 * 
 * This script downloads files from Cloudinary and uploads them to MinIO,
 * then updates the database URLs
 * Run with: tsx scripts/migrate-files.ts <metadata-file.json>
 */

import { PrismaClient } from '@prisma/client';
import { minioStorage } from '../src/core/storage/minio';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const prisma = new PrismaClient();

interface CloudinaryFile {
    public_id: string;
    secure_url: string;
    url: string;
    resource_type: string;
    format: string;
    bytes: number;
    folder?: string;
}

interface MetadataFile {
    timestamp: string;
    totalFiles: number;
    files: CloudinaryFile[];
}

// URL mapping: old Cloudinary URL -> new MinIO URL
const urlMapping: Map<string, string> = new Map();

function downloadFile(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const chunks: Buffer[] = [];
        
        client.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadFile(response.headers.location!).then(resolve).catch(reject);
            }
            
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => resolve(Buffer.concat(chunks)));
            response.on('error', reject);
        }).on('error', reject);
    });
}

function extractPathFromCloudinaryUrl(url: string, publicId: string): string {
    // Convert Cloudinary public_id to MinIO path
    // Example: "lms/content/batch-123/file" -> "content/batch-123/file"
    let minioPath = publicId;
    
    // Remove "lms/" prefix if present
    if (minioPath.startsWith('lms/')) {
        minioPath = minioPath.substring(4);
    }
    
    return minioPath;
}

async function migrateFileToMinIO(file: CloudinaryFile): Promise<string> {
    try {
        // Download file from Cloudinary
        console.log(`  Downloading: ${file.public_id}...`);
        const fileBuffer = await downloadFile(file.secure_url);
        
        // Determine file type and folder structure
        let minioPath: string;
        let folder: string;
        
        if (file.resource_type === 'image') {
            // Extract folder structure from public_id
            const pathParts = file.public_id.split('/');
            if (pathParts.length > 1) {
                folder = pathParts.slice(0, -1).join('/');
                const fileName = pathParts[pathParts.length - 1] + '.' + file.format;
                minioPath = `images/${folder}/${fileName}`;
            } else {
                minioPath = `images/${file.public_id}.${file.format}`;
            }
            
            // Create File object for upload
            const fileObj = new File([fileBuffer], `${file.public_id}.${file.format}`, {
                type: `image/${file.format}`,
            });
            
            const result = await minioStorage.uploadImage(fileObj, extractPathFromCloudinaryUrl(file.secure_url, file.public_id));
            return result.url;
            
        } else if (file.resource_type === 'raw') {
            // PDFs and other raw files
            const pathParts = file.public_id.split('/');
            if (pathParts.length > 1) {
                folder = pathParts.slice(0, -1).join('/');
                const fileName = pathParts[pathParts.length - 1] + '.' + file.format;
                minioPath = `pdfs/${folder}/${fileName}`;
            } else {
                minioPath = `pdfs/${file.public_id}.${file.format}`;
            }
            
            const fileObj = new File([fileBuffer], `${file.public_id}.${file.format}`, {
                type: 'application/pdf',
            });
            
            const result = await minioStorage.uploadPDF(fileObj, extractPathFromCloudinaryUrl(file.secure_url, file.public_id));
            return result.url;
            
        } else if (file.resource_type === 'video') {
            // Videos
            const pathParts = file.public_id.split('/');
            if (pathParts.length > 1) {
                folder = pathParts.slice(0, -1).join('/');
                const fileName = pathParts[pathParts.length - 1] + '.' + file.format;
                minioPath = `videos/${folder}/${fileName}`;
            } else {
                minioPath = `videos/${file.public_id}.${file.format}`;
            }
            
            const fileObj = new File([fileBuffer], `${file.public_id}.${file.format}`, {
                type: `video/${file.format}`,
            });
            
            const result = await minioStorage.uploadVideo(fileObj, extractPathFromCloudinaryUrl(file.secure_url, file.public_id));
            return result.url;
            
        } else {
            throw new Error(`Unsupported resource type: ${file.resource_type}`);
        }
        
    } catch (error) {
        console.error(`  ❌ Error migrating file ${file.public_id}:`, error);
        throw error;
    }
}

async function updateDatabaseUrls() {
    console.log('\nUpdating database URLs...\n');
    
    // Update Content table
    const contents = await prisma.content.findMany({
        where: {
            fileUrl: {
                contains: 'cloudinary.com',
            },
        },
    });
    
    let updated = 0;
    for (const content of contents) {
        const newUrl = urlMapping.get(content.fileUrl);
        if (newUrl) {
            await prisma.content.update({
                where: { id: content.id },
                data: { fileUrl: newUrl },
            });
            updated++;
        }
    }
    console.log(`✓ Updated ${updated} Content records`);
    
    // Update Assignment table
    const assignments = await prisma.assignment.findMany({
        where: {
            fileUrl: {
                contains: 'cloudinary.com',
            },
        },
    });
    
    updated = 0;
    for (const assignment of assignments) {
        if (assignment.fileUrl) {
            const newUrl = urlMapping.get(assignment.fileUrl);
            if (newUrl) {
                await prisma.assignment.update({
                    where: { id: assignment.id },
                    data: { fileUrl: newUrl },
                });
                updated++;
            }
        }
    }
    console.log(`✓ Updated ${updated} Assignment records`);
    
    // Update AssignmentSubmission table
    const submissions = await prisma.assignmentSubmission.findMany({
        where: {
            fileUrl: {
                contains: 'cloudinary.com',
            },
        },
    });
    
    updated = 0;
    for (const submission of submissions) {
        if (submission.fileUrl) {
            const newUrl = urlMapping.get(submission.fileUrl);
            if (newUrl) {
                await prisma.assignmentSubmission.update({
                    where: { id: submission.id },
                    data: { fileUrl: newUrl },
                });
                updated++;
            }
        }
    }
    console.log(`✓ Updated ${updated} AssignmentSubmission records`);
    
    // Update User profile images
    const users = await prisma.user.findMany({
        where: {
            imageUrl: {
                contains: 'cloudinary.com',
            },
        },
    });
    
    updated = 0;
    for (const user of users) {
        if (user.imageUrl) {
            const newUrl = urlMapping.get(user.imageUrl);
            if (newUrl) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { imageUrl: newUrl },
                });
                updated++;
            }
        }
    }
    console.log(`✓ Updated ${updated} User profile images`);
}

async function migrateFiles(metadataFile: string) {
    console.log(`Loading metadata from: ${metadataFile}\n`);
    
    if (!fs.existsSync(metadataFile)) {
        throw new Error(`Metadata file not found: ${metadataFile}`);
    }

    const metadata: MetadataFile = JSON.parse(fs.readFileSync(metadataFile, 'utf-8'));
    
    console.log(`Metadata timestamp: ${metadata.timestamp}`);
    console.log(`Files to migrate: ${metadata.totalFiles}\n`);

    let migrated = 0;
    let failed = 0;
    const errors: Array<{ file: string; error: string }> = [];

    for (const file of metadata.files) {
        try {
            console.log(`[${migrated + failed + 1}/${metadata.totalFiles}] Migrating: ${file.public_id}`);
            
            const newUrl = await migrateFileToMinIO(file);
            urlMapping.set(file.secure_url, newUrl);
            urlMapping.set(file.url, newUrl);
            
            migrated++;
            console.log(`  ✓ Migrated to: ${newUrl}\n`);
            
            // Small delay to avoid overwhelming MinIO
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            failed++;
            const errorMsg = (error as Error).message;
            errors.push({ file: file.public_id, error: errorMsg });
            console.log(`  ❌ Failed: ${errorMsg}\n`);
        }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`  ✓ Successfully migrated: ${migrated}`);
    console.log(`  ❌ Failed: ${failed}`);

    if (errors.length > 0) {
        const errorFile = path.join(process.cwd(), 'backups', `migration-errors-${Date.now()}.json`);
        fs.writeFileSync(errorFile, JSON.stringify(errors, null, 2));
        console.log(`  📝 Errors saved to: ${errorFile}`);
    }

    // Save URL mapping
    const mappingFile = path.join(process.cwd(), 'backups', `url-mapping-${Date.now()}.json`);
    fs.writeFileSync(mappingFile, JSON.stringify(Array.from(urlMapping.entries()), null, 2));
    console.log(`  📝 URL mapping saved to: ${mappingFile}`);

    // Update database
    if (migrated > 0) {
        await updateDatabaseUrls();
    }
}

async function main() {
    const metadataFile = process.argv[2];

    if (!metadataFile) {
        console.error('Usage: tsx scripts/migrate-files.ts <metadata-file.json>');
        console.error('Example: tsx scripts/migrate-files.ts backups/cloudinary/cloudinary-metadata-1234567890.json');
        process.exit(1);
    }

    try {
        console.log('Connecting to local PostgreSQL...');
        await prisma.$connect();
        console.log('Connected!\n');

        await migrateFiles(metadataFile);
        
        console.log('\n✅ File migration completed!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();

