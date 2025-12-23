// Comprehensive Seed script for LMS database
import { PrismaClient, UserRole, Language, ContentType, TestType, QuestionType, NoticeType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper function to generate random date within range
function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to get random item from array
function randomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

async function main() {
    console.log('🌱 Starting comprehensive database seed...\n');

    // Optional: Clear existing data
    const CLEAR_DATABASE = process.env.CLEAR_DB === 'true';

    if (CLEAR_DATABASE) {
        console.log('🗑️  Clearing existing data...');
        await prisma.answer.deleteMany();
        await prisma.testSubmission.deleteMany();
        await prisma.question.deleteMany();
        await prisma.test.deleteMany();
        await prisma.assignmentSubmission.deleteMany();
        await prisma.assignment.deleteMany();
        await prisma.attendance.deleteMany();
        await prisma.content.deleteMany();
        await prisma.batchTeacher.deleteMany();
        await prisma.subject.deleteMany();
        await prisma.student.deleteMany();
        await prisma.batch.deleteMany();
        await prisma.academicYear.deleteMany();
        await prisma.notice.deleteMany();
        await prisma.session.deleteMany();
        await prisma.teacher.deleteMany();
        await prisma.admin.deleteMany();
        await prisma.user.deleteMany();
        console.log('✅ Database cleared\n');
    }

    // Hash password for all test users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // ============================================
    // USERS & PROFILES
    // ============================================
    console.log('👥 Creating users and profiles...');

    // Create 5 Admin Users
    const adminUsers = [];
    const adminNames = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Gupta', 'Vikram Singh'];
    for (let i = 0; i < 5; i++) {
        const admin = await prisma.user.create({
            data: {
                email: `admin${i + 1}@lms.com`,
                password: hashedPassword,
                name: adminNames[i],
                phone: `+91-98765432${10 + i}`,
                role: UserRole.ADMIN,
                preferredLanguage: i % 2 === 0 ? Language.EN : Language.AS,
                isActive: true,
                adminProfile: {
                    create: {},
                },
            },
        });
        adminUsers.push(admin);
    }
    console.log(`✅ Created ${adminUsers.length} admins`);

    // Create 10 Teacher Users
    const teacherUsers = [];
    const teacherNames = [
        'Dr. Ananya Bora', 'Prof. Ravi Nath', 'Ms. Kavita Das', 'Mr. Suresh Baruah',
        'Dr. Meena Gogoi', 'Prof. Kamal Sharma', 'Ms. Rina Devi', 'Mr. Bhaskar Kalita',
        'Dr. Pankaj Saikia', 'Prof. Anjali Hazarika'
    ];
    for (let i = 0; i < 10; i++) {
        const teacher = await prisma.user.create({
            data: {
                email: `teacher${i + 1}@lms.com`,
                password: hashedPassword,
                name: teacherNames[i],
                phone: `+91-98765433${10 + i}`,
                role: UserRole.TEACHER,
                preferredLanguage: i % 3 === 0 ? Language.AS : Language.EN,
                isActive: true,
                teacherProfile: {
                    create: {
                        name: teacherNames[i],
                    },
                },
            },
        });
        teacherUsers.push(teacher);
    }
    console.log(`✅ Created ${teacherUsers.length} teachers`);

    // Fetch teacher profiles
    const teacherProfiles = await prisma.teacher.findMany({
        where: { userId: { in: teacherUsers.map(t => t.id) } },
    });

    // ============================================
    // ACADEMIC YEARS
    // ============================================
    console.log('\n📅 Creating academic years...');

    const academicYears = [];
    const yearData = [
        { year: '2023-2024', startDate: new Date('2023-04-01'), endDate: new Date('2024-03-31'), isActive: false },
        { year: '2024-2025', startDate: new Date('2024-04-01'), endDate: new Date('2025-03-31'), isActive: true },
        { year: '2025-2026', startDate: new Date('2025-04-01'), endDate: new Date('2026-03-31'), isActive: false },
    ];

    for (const data of yearData) {
        const year = await prisma.academicYear.upsert({
            where: { year: data.year },
            update: data,
            create: data,
        });
        academicYears.push(year);
    }
    console.log(`✅ Created ${academicYears.length} academic years`);

    // ============================================
    // BATCHES
    // ============================================
    console.log('\n🎓 Creating batches...');

    const activeYear = academicYears.find(y => y.isActive)!;
    const batchNames = [
        'Class 8 - Section A',
        'Class 8 - Section B',
        'Class 9 - Science',
        'Class 10 - Science',
        'Class 10 - Commerce',
        'Class 11 - Science',
        'Class 12 - Science',
        'Class 12 - Commerce'
    ];

    const batches = [];
    for (const name of batchNames) {
        const batch = await prisma.batch.create({
            data: {
                name,
                academicYearId: activeYear.id,
            },
        });
        batches.push(batch);
    }
    console.log(`✅ Created ${batches.length} batches`);

    // ============================================
    // SUBJECTS
    // ============================================
    console.log('\n📚 Creating subjects...');

    const subjectsByBatch = [
        ['Mathematics', 'Science', 'English', 'Assamese', 'Social Science'],
        ['Mathematics', 'Science', 'English', 'Assamese', 'Social Science'],
        ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Assamese'],
        ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Assamese'],
        ['Mathematics', 'Accountancy', 'Business Studies', 'Economics', 'English'],
        ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'],
        ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'],
        ['Mathematics', 'Accountancy', 'Business Studies', 'Economics', 'English'],
    ];

    const allSubjects = [];
    for (let i = 0; i < batches.length; i++) {
        for (const subjectName of subjectsByBatch[i]) {
            const subject = await prisma.subject.create({
                data: {
                    name: subjectName,
                    batchId: batches[i].id,
                },
            });
            allSubjects.push(subject);
        }
    }
    console.log(`✅ Created ${allSubjects.length} subjects`);

    // ============================================
    // BATCH-TEACHER ASSIGNMENTS
    // ============================================
    console.log('\n👨‍🏫 Assigning teachers to batches...');

    let assignmentCount = 0;
    for (let i = 0; i < batches.length; i++) {
        // Assign 2-3 teachers per batch
        const numTeachers = 2 + (i % 2);
        for (let j = 0; j < numTeachers; j++) {
            const teacherIndex = (i * 2 + j) % teacherProfiles.length;
            await prisma.batchTeacher.create({
                data: {
                    batchId: batches[i].id,
                    teacherId: teacherProfiles[teacherIndex].id,
                },
            });
            assignmentCount++;
        }
    }
    console.log(`✅ Created ${assignmentCount} batch-teacher assignments`);

    // ============================================
    // STUDENTS
    // ============================================
    console.log('\n🎒 Creating students...');

    const studentFirstNames = [
        'Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna',
        'Ishaan', 'Shaurya', 'Atharv', 'Advait', 'Pranav', 'Dhruv', 'Aryan',
        'Ananya', 'Diya', 'Aadhya', 'Saanvi', 'Kiara', 'Navya', 'Pari', 'Aarohi',
        'Myra', 'Sara', 'Anika', 'Riya', 'Avni', 'Shanaya', 'Ishita', 'Prisha',
        'Kavya', 'Tara', 'Zara', 'Siya'
    ];

    const studentLastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Das', 'Bora', 'Nath', 'Gogoi', 'Baruah', 'Saikia'];

    const studentUsers = [];
    for (let i = 0; i < 35; i++) {
        const firstName = studentFirstNames[i];
        const lastName = randomItem(studentLastNames);
        const fullName = `${firstName} ${lastName}`;
        const batchIndex = i % batches.length;

        const student = await prisma.user.create({
            data: {
                email: `student${i + 1}@lms.com`,
                password: hashedPassword,
                name: fullName,
                phone: `+91-98765434${10 + i}`,
                role: UserRole.STUDENT,
                preferredLanguage: i % 3 === 0 ? Language.AS : Language.EN,
                isActive: true,
                studentProfile: {
                    create: {
                        name: fullName,
                        phone: `+91-98765434${10 + i}`,
                        batchId: batches[batchIndex].id,
                    },
                },
            },
        });
        studentUsers.push(student);
    }
    console.log(`✅ Created ${studentUsers.length} students`);

    // Fetch student profiles
    const studentProfiles = await prisma.student.findMany({
        where: { userId: { in: studentUsers.map(s => s.id) } },
    });

    // ============================================
    // CONTENT
    // ============================================
    console.log('\n📄 Creating content items...');

    const contentItems = [];
    const chapters = ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5'];
    const contentTitles = {
        PDF: ['Introduction to', 'Advanced Concepts in', 'Practice Problems for', 'Summary of', 'Notes on'],
        IMAGE: ['Diagram:', 'Chart:', 'Illustration:', 'Graph:', 'Visual Guide:'],
        VIDEO: ['Lecture:', 'Tutorial:', 'Explanation:', 'Demonstration:', 'Class Recording:'],
    };

    for (let i = 0; i < 30; i++) {
        const batch = randomItem(batches);
        const batchSubjects = allSubjects.filter(s => s.batchId === batch.id);
        const subject = randomItem(batchSubjects);
        const contentType = randomItem([ContentType.PDF, ContentType.IMAGE, ContentType.VIDEO]);
        const titlePrefix = randomItem(contentTitles[contentType]);
        const chapter = randomItem(chapters);
        const teacherProfile = randomItem(teacherProfiles);

        const content = await prisma.content.create({
            data: {
                title: `${titlePrefix} ${subject.name}`,
                description: `Study material for ${subject.name} - ${chapter}`,
                type: contentType,
                fileUrl: `https://example.com/${contentType.toLowerCase()}/${i + 1}.${contentType === ContentType.PDF ? 'pdf' : contentType === ContentType.VIDEO ? 'mp4' : 'jpg'}`,
                fileSize: Math.floor(Math.random() * 5000000) + 100000,
                fileName: `${subject.name.toLowerCase()}_${chapter.toLowerCase().replace(' ', '_')}.${contentType === ContentType.PDF ? 'pdf' : contentType === ContentType.VIDEO ? 'mp4' : 'jpg'}`,
                batchId: batch.id,
                subjectId: subject.id,
                chapterName: chapter,
                language: i % 4 === 0 ? Language.AS : Language.EN,
                isDownloadable: true,
                uploadedById: teacherProfile.id,
            },
        });
        contentItems.push(content);
    }
    console.log(`✅ Created ${contentItems.length} content items`);

    // ============================================
    // TESTS
    // ============================================
    console.log('\n📝 Creating tests with questions...');

    const tests = [];
    const testTypes = [TestType.PRACTICE, TestType.WEEKLY, TestType.MONTHLY];

    for (let i = 0; i < 10; i++) {
        const batch = batches[i % batches.length];
        const batchSubjects = allSubjects.filter(s => s.batchId === batch.id);
        const subject = randomItem(batchSubjects);
        const teacherProfile = randomItem(teacherProfiles);
        const testType = randomItem(testTypes);

        const test = await prisma.test.create({
            data: {
                title: `${testType} Test ${i + 1} - ${subject.name}`,
                description: `Test covering important topics in ${subject.name}`,
                type: testType,
                batchId: batch.id,
                subjectId: subject.id,
                durationMinutes: testType === TestType.PRACTICE ? 30 : testType === TestType.WEEKLY ? 60 : 120,
                totalMarks: testType === TestType.PRACTICE ? 20 : testType === TestType.WEEKLY ? 50 : 100,
                createdById: teacherProfile.id,
                isActive: true,
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        tests.push(test);

        // Create 5-10 questions per test
        const numQuestions = 5 + Math.floor(Math.random() * 6);
        for (let q = 0; q < numQuestions; q++) {
            const questionType = randomItem([QuestionType.MCQ, QuestionType.SHORT_ANSWER]);
            const marks = questionType === QuestionType.MCQ ? 1 : Math.floor(Math.random() * 3) + 2;

            const options = questionType === QuestionType.MCQ ? {
                A: 'Option A - First answer',
                B: 'Option B - Second answer',
                C: 'Option C - Third answer',
                D: 'Option D - Fourth answer',
                correct: randomItem(['A', 'B', 'C', 'D'])
            } : undefined;

            await prisma.question.create({
                data: {
                    testId: test.id,
                    questionText: `Question ${q + 1}: Explain the concept of ${subject.name} topic ${q + 1}?`,
                    questionTextAssamese: q % 3 === 0 ? `প্ৰশ্ন ${q + 1}: ${subject.name} বিষয় ${q + 1} ৰ ধাৰণা ব্যাখ্যা কৰক?` : null,
                    type: questionType,
                    options: options as any,
                    correctAnswer: questionType === QuestionType.SHORT_ANSWER ? 'Sample correct answer' : null,
                    marks,
                    order: q + 1,
                },
            });
        }
    }
    console.log(`✅ Created ${tests.length} tests with questions`);

    // ============================================
    // TEST SUBMISSIONS
    // ============================================
    console.log('\n✍️ Creating test submissions...');

    let submissionCount = 0;
    for (const test of tests) {
        const batchStudentProfiles = studentProfiles.filter(s => s.batchId === test.batchId);
        const numSubmissions = Math.floor(batchStudentProfiles.length * (0.6 + Math.random() * 0.2));

        for (let i = 0; i < numSubmissions; i++) {
            const studentProfile = batchStudentProfiles[i];
            if (!studentProfile) continue;

            const questions = await prisma.question.findMany({
                where: { testId: test.id },
            });

            const scorePercentage = 0.6 + Math.random() * 0.35;
            const obtainedMarks = Math.floor(test.totalMarks * scorePercentage);
            const timeSpent = Math.floor((test.durationMinutes || 60) * (0.7 + Math.random() * 0.3));

            const submission = await prisma.testSubmission.create({
                data: {
                    testId: test.id,
                    studentId: studentProfile.id,
                    totalMarks: test.totalMarks,
                    obtainedMarks,
                    timeSpent,
                    submittedAt: randomDate(test.startDate!, new Date()),
                },
            });

            for (const question of questions) {
                const isCorrect = Math.random() < scorePercentage;
                const marksObtained = isCorrect ? question.marks : Math.floor(question.marks * Math.random() * 0.5);

                await prisma.answer.create({
                    data: {
                        submissionId: submission.id,
                        questionId: question.id,
                        answerText: question.type === QuestionType.SHORT_ANSWER ? 'Student answer text here' : null,
                        selectedOption: question.type === QuestionType.MCQ ? randomItem(['A', 'B', 'C', 'D']) : null,
                        isCorrect,
                        marksObtained,
                    },
                });
            }
            submissionCount++;
        }
    }
    console.log(`✅ Created ${submissionCount} test submissions with answers`);

    // ============================================
    // ASSIGNMENTS
    // ============================================
    console.log('\n📋 Creating assignments...');

    const assignments = [];
    for (let i = 0; i < 15; i++) {
        const batch = batches[i % batches.length];
        const batchSubjects = allSubjects.filter(s => s.batchId === batch.id);
        const subject = randomItem(batchSubjects);
        const teacherProfile = randomItem(teacherProfiles);

        const assignment = await prisma.assignment.create({
            data: {
                title: `Assignment ${i + 1} - ${subject.name}`,
                description: `Complete the exercises from chapter ${(i % 5) + 1}. Submit handwritten or typed solutions.`,
                batchId: batch.id,
                subjectId: subject.id,
                fileUrl: i % 3 === 0 ? `https://example.com/assignments/assignment_${i + 1}.pdf` : null,
                dueDate: new Date(Date.now() + (i % 2 === 0 ? 7 : -3) * 24 * 60 * 60 * 1000),
                createdById: teacherProfile.id,
            },
        });
        assignments.push(assignment);
    }
    console.log(`✅ Created ${assignments.length} assignments`);

    // ============================================
    // ASSIGNMENT SUBMISSIONS
    // ============================================
    console.log('\n📤 Creating assignment submissions...');

    let assignmentSubmissionCount = 0;
    for (const assignment of assignments) {
        const batchStudentProfiles = studentProfiles.filter(s => s.batchId === assignment.batchId);
        const numSubmissions = Math.floor(batchStudentProfiles.length * (0.5 + Math.random() * 0.3));

        for (let i = 0; i < numSubmissions; i++) {
            const studentProfile = batchStudentProfiles[i];
            if (!studentProfile) continue;

            const isChecked = Math.random() > 0.3;
            const marks = isChecked ? Math.floor(Math.random() * 20) + 10 : null;
            const checkedByTeacher = isChecked ? randomItem(teacherProfiles) : null;

            await prisma.assignmentSubmission.create({
                data: {
                    assignmentId: assignment.id,
                    studentId: studentProfile.id,
                    fileUrl: `https://example.com/submissions/student_${i + 1}_assignment_${assignment.id}.pdf`,
                    submittedAt: randomDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), new Date()),
                    isChecked,
                    marks,
                    remarks: isChecked ? (marks! > 15 ? 'Excellent work!' : 'Good effort, needs improvement') : null,
                    checkedById: checkedByTeacher?.id || null,
                    checkedAt: isChecked ? new Date() : null,
                },
            });
            assignmentSubmissionCount++;
        }
    }
    console.log(`✅ Created ${assignmentSubmissionCount} assignment submissions`);

    // ============================================
    // ATTENDANCE
    // ============================================
    console.log('\n📊 Creating attendance records...');

    let attendanceCount = 0;
    const today = new Date();
    const threeMonthsAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

    for (const batch of batches) {
        const batchStudentProfiles = studentProfiles.filter(s => s.batchId === batch.id);

        for (let d = new Date(threeMonthsAgo); d <= today; d.setDate(d.getDate() + 1)) {
            const dayOfWeek = d.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) continue;

            const attendanceDate = new Date(d);
            const markedByUser = randomItem(teacherUsers);

            for (const studentProfile of batchStudentProfiles) {
                if (!studentProfile) continue;

                const attendanceRate = 0.8 + Math.random() * 0.15;
                const present = Math.random() < attendanceRate;

                await prisma.attendance.create({
                    data: {
                        studentId: studentProfile.id,
                        batchId: batch.id,
                        date: attendanceDate,
                        present,
                        remarks: !present && Math.random() > 0.7 ? 'Sick leave' : null,
                        markedById: markedByUser.id,
                    },
                });
                attendanceCount++;
            }
        }
    }
    console.log(`✅ Created ${attendanceCount} attendance records`);

    // ============================================
    // NOTICES
    // ============================================
    console.log('\n📢 Creating notices...');

    const noticeData = [
        {
            title: 'Welcome to Academic Year 2024-2025',
            content: 'We welcome all students to the new academic year. Please check your schedules and attend all classes regularly.',
            contentAssamese: 'আমি সকলো ছাত্ৰ-ছাত্ৰীক নতুন শৈক্ষিক বৰ্ষলৈ স্বাগতম জনাইছো। অনুগ্ৰহ কৰি আপোনাৰ সময়সূচী পৰীক্ষা কৰক আৰু নিয়মীয়াকৈ সকলো শ্ৰেণীত উপস্থিত থাকক।',
            type: NoticeType.GENERAL,
            priority: 5,
        },
        {
            title: 'Mid-Term Examination Schedule',
            content: 'Mid-term examinations will be conducted from January 15-25, 2025. Detailed schedule will be shared soon.',
            contentAssamese: 'মধ্যম ম্যাদী পৰীক্ষা ১৫-২৫ জানুৱাৰী, ২০২৫ ত অনুষ্ঠিত হ\'ব। বিশদ সময়সূচী শীঘ্ৰে শ্বেয়াৰ কৰা হ\'ব।',
            type: NoticeType.EXAM_DATE,
            priority: 10,
        },
        {
            title: 'Republic Day Holiday',
            content: 'The coaching center will remain closed on January 26, 2025 on account of Republic Day.',
            type: NoticeType.HOLIDAY,
            priority: 7,
        },
        {
            title: 'Parent-Teacher Meeting',
            content: 'Parent-teacher meeting is scheduled for December 28, 2024. All parents are requested to attend.',
            type: NoticeType.IMPORTANT,
            priority: 9,
        },
        {
            title: 'New Study Material Available',
            content: 'New study materials for all subjects have been uploaded. Please check the content section.',
            type: NoticeType.GENERAL,
            priority: 5,
        },
        {
            title: 'Library Timing Update',
            content: 'Library will now be open from 8 AM to 8 PM on all working days.',
            type: NoticeType.GENERAL,
            priority: 4,
        },
        {
            title: 'Final Examination Schedule',
            content: 'Final examinations will be held in March 2025. Students are advised to start preparation.',
            type: NoticeType.EXAM_DATE,
            priority: 8,
        },
        {
            title: 'Science Exhibition',
            content: 'Annual science exhibition will be organized on February 15, 2025. Interested students can register.',
            type: NoticeType.GENERAL,
            priority: 6,
        },
        {
            title: 'Fee Payment Reminder',
            content: 'Students are reminded to clear their pending fees by December 31, 2024.',
            type: NoticeType.IMPORTANT,
            priority: 10,
        },
        {
            title: 'Winter Break Notice',
            content: 'Coaching center will be closed from December 24-26, 2024 for winter break.',
            type: NoticeType.HOLIDAY,
            priority: 7,
        },
    ];

    const notices = [];
    for (let i = 0; i < noticeData.length; i++) {
        const data = noticeData[i];
        const notice = await prisma.notice.create({
            data: {
                ...data,
                batchId: i % 3 === 0 ? randomItem(batches).id : null,
                isActive: i < 8,
                expiresAt: i % 2 === 0 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
            },
        });
        notices.push(notice);
    }
    console.log(`✅ Created ${notices.length} notices`);

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Database seeding completed successfully!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${adminUsers.length + teacherUsers.length + studentUsers.length}`);
    console.log(`      - Admins: ${adminUsers.length}`);
    console.log(`      - Teachers: ${teacherUsers.length}`);
    console.log(`      - Students: ${studentUsers.length}`);
    console.log(`   📅 Academic Years: ${academicYears.length}`);
    console.log(`   🎓 Batches: ${batches.length}`);
    console.log(`   📚 Subjects: ${allSubjects.length}`);
    console.log(`   👨‍🏫 Batch-Teacher Assignments: ${assignmentCount}`);
    console.log(`   📄 Content Items: ${contentItems.length}`);
    console.log(`   📝 Tests: ${tests.length}`);
    console.log(`   ✍️ Test Submissions: ${submissionCount}`);
    console.log(`   📋 Assignments: ${assignments.length}`);
    console.log(`   📤 Assignment Submissions: ${assignmentSubmissionCount}`);
    console.log(`   📊 Attendance Records: ${attendanceCount}`);
    console.log(`   📢 Notices: ${notices.length}`);
    console.log('\n📝 Test Credentials:');
    console.log('━'.repeat(60));
    console.log('Admins:');
    for (let i = 0; i < 5; i++) {
        console.log(`   admin${i + 1}@lms.com / password123`);
    }
    console.log('\nTeachers:');
    for (let i = 0; i < 3; i++) {
        console.log(`   teacher${i + 1}@lms.com / password123`);
    }
    console.log('   ... (7 more teachers)');
    console.log('\nStudents:');
    for (let i = 0; i < 5; i++) {
        console.log(`   student${i + 1}@lms.com / password123`);
    }
    console.log('   ... (30 more students)');
    console.log('━'.repeat(60));
    console.log('\n💡 Next Steps:');
    console.log('   1. Run: npm run db:studio (to view data in Prisma Studio)');
    console.log('   2. Run: npm run dev (to start the application)');
    console.log('   3. Login with any of the above credentials');
    console.log('   4. Test all features with the sample data!');
    console.log('');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
