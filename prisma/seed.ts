// Seed script for LMS database
import { PrismaClient, UserRole, Language } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Hash password for all test users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Admin User',
            phone: '+91-9876543210',
            role: UserRole.ADMIN,
            preferredLanguage: Language.EN,
            isActive: true,
            adminProfile: {
                create: {},
            },
        },
    });

    console.log('✅ Created admin:', admin.email);

    // Create Teacher User
    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@example.com' },
        update: {},
        create: {
            email: 'teacher@example.com',
            password: hashedPassword,
            name: 'John Teacher',
            phone: '+91-9876543211',
            role: UserRole.TEACHER,
            preferredLanguage: Language.EN,
            isActive: true,
            teacherProfile: {
                create: {
                    name: 'John Teacher',
                },
            },
        },
    });

    console.log('✅ Created teacher:', teacher.email);

    // Create Academic Year
    const academicYear = await prisma.academicYear.upsert({
        where: { year: '2024-2025' },
        update: {},
        create: {
            year: '2024-2025',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            isActive: true,
        },
    });

    console.log('✅ Created academic year:', academicYear.year);

    // Create a Batch
    const batch = await prisma.batch.create({
        data: {
            name: 'Class 10 - Science Batch A',
            academicYearId: academicYear.id,
        },
    });

    console.log('✅ Created batch:', batch.name);

    // Create Student User
    const student = await prisma.user.upsert({
        where: { email: 'student@example.com' },
        update: {},
        create: {
            email: 'student@example.com',
            password: hashedPassword,
            name: 'Alice Student',
            phone: '+91-9876543212',
            role: UserRole.STUDENT,
            preferredLanguage: Language.EN,
            isActive: true,
            studentProfile: {
                create: {
                    name: 'Alice Student',
                    phone: '+91-9876543212',
                    batchId: batch.id,
                },
            },
        },
    });

    console.log('✅ Created student:', student.email);

    // Create a Subject
    const subject = await prisma.subject.create({
        data: {
            name: 'Physics',
            batchId: batch.id,
        },
    });

    console.log('✅ Created subject:', subject.name);

    // Create sample content
    const content = await prisma.content.create({
        data: {
            title: 'Introduction to Motion',
            description: 'Basic concepts of motion and velocity',
            type: 'PDF',
            fileUrl: 'https://example.com/motion.pdf',
            batchId: batch.id,
            subjectId: subject.id,
            uploadedById: teacher.id,
            chapterName: 'Chapter 1',
        },
    });

    console.log('✅ Created content:', content.title);

    // Create a Notice
    const notice = await prisma.notice.create({
        data: {
            title: 'Welcome to LMS!',
            content: 'Welcome to our Learning Management System. All students are requested to check their dashboards regularly.',
            isActive: true,
        },
    });

    console.log('✅ Created notice:', notice.title);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('━'.repeat(50));
    console.log('Admin:   admin@example.com / password123');
    console.log('Teacher: teacher@example.com / password123');
    console.log('Student: student@example.com / password123');
    console.log('━'.repeat(50));
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
