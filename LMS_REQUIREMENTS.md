# LMS Requirements Document
## Offline Coaching Center (Tier-3 Cities)

---

## 1. Project Overview

### 1.1 Purpose
The Learning Management System (LMS) is designed to **support offline coaching**, not replace it. The system will serve as a digital companion to traditional classroom teaching in tier-3 cities.

### 1.2 Primary Goals
- Centralized student record management
- Digital content distribution (notes, PDFs, recorded classes)
- Simple test and assessment system
- Attendance and performance tracking
- Bilingual support (English + Assamese)

### 1.3 Key Principles
- **Simplicity**: Easy to use for non-technical users
- **Lightweight**: Low internet usage, fast loading
- **Mobile-friendly**: Accessible on phones and laptops
- **Offline-first**: Support for offline coaching centers

---

## 2. Target Users

### 2.1 User Roles

| Role | Description | Technical Proficiency |
|------|-------------|----------------------|
| **Students** | School/competitive exam level | Low |
| **Teachers** | Content creators, test makers | Low to Medium |
| **Admin/Owner** | System manager | Medium |

### 2.2 User Expectations
- Simple, intuitive interface
- Minimal training required
- Works on basic smartphones
- Low data consumption

---

## 3. Language Requirements

### 3.1 Supported Languages
1. **English** (Primary)
2. **Assamese** (Regional)

### 3.2 Language Features

#### Language Selection
- Language choice at login screen
- User preference saved in profile
- Easy language switching

#### Assamese Support Areas
- PDF notes and study materials
- Test questions and instructions
- System notifications and announcements
- UI labels and buttons

#### Content Management
- Same content can be uploaded in both languages
- Language-specific folders for organization
- Teachers can upload bilingual content

---

## 4. Core Features

### 4.1 Student Management

#### Student Registration
- **Admin-controlled only** (no self-registration)
- Manual student addition by admin

#### Student Profile Fields
```
- Full Name
- Phone Number
- Batch Assignment
- Academic Year
- Date of Enrollment
- Student ID (auto-generated)
```

#### Student Operations
- Add new student
- Edit student details
- Assign to batch
- View student history
- Deactivate student (if needed)

---

### 4.2 Batch & Course Management

#### Batch Structure
```
Batch
├── Batch Name (e.g., "Class 10 - Science")
├── Academic Year (e.g., "2024-25")
├── Assigned Subjects
├── Assigned Teachers
└── Enrolled Students
```

#### Batch Features
- Create batches by class level
- Assign multiple subjects per batch
- Assign teachers to batches
- Academic year management
- Batch-wise content visibility

#### Subject Management
- Add subjects to batches
- Subject-wise content organization
- Chapter/topic structure

---

### 4.3 Content Sharing System

> **Most Important Feature**

#### Supported Content Types

| Type | Priority | Format | Storage | Notes |
|------|----------|--------|---------|-------|
| PDF Notes | **High** | .pdf | Supabase Storage | Main content format |
| Images | **Medium** | .jpg, .png | **Cloudinary** | Diagrams, handwritten notes |
| Recorded Videos | **Low** | YouTube iframe | **YouTube (Unlisted)** | Pre-recorded lectures |

#### Storage Strategy
- **PDFs**: Stored in Supabase Storage (organized by batch/subject/chapter)
- **Images**: Uploaded to Cloudinary CDN for fast delivery and optimization
- **Videos**: YouTube unlisted videos (teacher pastes iframe/URL from dashboard)

#### Content Organization
```
Batch
└── Subject
    └── Chapter
        ├── PDF Notes
        ├── Images
        └── Videos (optional)
```

#### Content Features
- **Chapter-wise folders** for organization
- **Batch-wise visibility** control
- **Download allowed** for offline access
- **Simple upload** process for teachers
- **Preview** before download
- **Search** by chapter/topic name

#### Upload Process (Teacher)
1. Select batch and subject
2. Choose chapter/topic
3. Upload file (PDF/image/video)
4. Add description (optional)
5. Select language (English/Assamese)
6. Publish to students

#### Important Notes
- ❌ **No live streaming**
- ❌ **No heavy video hosting**
- ✅ **Pre-recorded videos only** (optional)
- ✅ **Focus on PDFs and images**

---

### 4.4 Attendance Management

#### Attendance Features
- **Daily attendance** marking
- **Batch-wise** attendance entry
- **Manual entry** by teacher/admin
- **Student attendance history**
- **Simple attendance reports**

#### Attendance Workflow
1. Teacher selects batch and date
2. Mark present/absent for each student
3. Save attendance
4. Students can view their attendance percentage

#### Attendance Reports
- Individual student attendance
- Batch-wise attendance summary
- Monthly attendance reports
- Attendance percentage calculation

---

### 4.5 Test & Exam System

#### Test Types
1. **Practice Tests** - For self-assessment
2. **Weekly Tests** - Regular assessments
3. **Monthly Tests** - Major evaluations

#### Question Types
- **MCQ** (Multiple Choice Questions) - Primary
- **Short Answer** (Optional) - Manual checking

#### Test Features

**For Teachers:**
- Create tests with questions
- Set time limit
- Assign to batch
- Upload offline test marks manually
- View test results

**For Students:**
- Time-based test interface
- Auto-submit on time expiry
- Immediate results for MCQs
- View marks and correct answers (after submission)

#### Test Workflow
```
Teacher Creates Test
    ↓
Assigns to Batch
    ↓
Students Take Test
    ↓
Auto Result (MCQ) / Manual Checking (Short Answer)
    ↓
Students View Results
```

#### Offline Test Support
- Teacher can manually upload marks for offline tests
- Bulk upload option for test scores

---

### 4.6 Homework & Assignments

#### Homework Features
- Teacher uploads homework (PDF/image)
- Students view homework in their dashboard
- **Optional**: Students upload submission (PDF/image)
- Teacher marks as "Checked" or "Pending"

#### Homework Workflow
1. Teacher creates homework
2. Uploads homework file
3. Assigns to batch
4. Students download and complete
5. Students upload submission (optional)
6. Teacher reviews and marks as checked

---

### 4.7 Student Dashboard

#### Dashboard Components

**Simple View with:**
- 📚 **Available Notes** - Latest uploaded content
- 📝 **Tests & Results** - Upcoming and completed tests
- 📊 **Attendance Percentage** - Current attendance status
- 📢 **Important Announcements** - Notices from admin
- 📖 **Homework** - Pending assignments

#### Dashboard Layout
```
┌─────────────────────────────────────┐
│  Welcome, [Student Name]            │
├─────────────────────────────────────┤
│  Attendance: 85%                    │
│  Pending Tests: 2                   │
│  New Notes: 5                       │
├─────────────────────────────────────┤
│  📢 Announcements                   │
│  📚 Recent Notes                    │
│  📝 Upcoming Tests                  │
│  📖 Homework                        │
└─────────────────────────────────────┘
```

---

### 4.8 Teacher Panel

#### Teacher Features (Simple & Focused)

**Content Management:**
- Upload notes (PDF/images)
- Organize by chapter
- Delete/update content

**Assessment:**
- Create tests
- View test results
- Upload offline test marks

**Attendance:**
- Mark daily attendance
- View attendance reports

**Student Performance:**
- View student marks
- Track individual progress

#### Important Notes
- ❌ **No complex analytics**
- ❌ **No advanced reporting**
- ✅ **Simple, task-focused interface**

---

### 4.9 Admin Panel

#### Admin Responsibilities

**Student Management:**
- Add/edit students
- Assign students to batches
- Manage student records

**Batch & Course Setup:**
- Create batches
- Add subjects
- Assign teachers to batches
- Manage academic years

**Content Oversight:**
- Upload important notices
- Manage announcements
- Monitor system usage

**Reporting:**
- Attendance reports
- Test result summaries
- Batch performance overview

#### Admin Dashboard
```
┌─────────────────────────────────────┐
│  Total Students: 250                │
│  Total Batches: 12                  │
│  Active Teachers: 8                 │
├─────────────────────────────────────┤
│  📊 Quick Reports                   │
│  👥 Student Management              │
│  📚 Batch Management                │
│  📢 Announcements                   │
└─────────────────────────────────────┘
```

---

## 5. Communication Features

### 5.1 Notice Board (Inside LMS)

**Notice Types:**
- Exam date announcements
- Holiday announcements
- Important updates
- Schedule changes

**Notice Features:**
- Admin creates notices
- Visible to all users
- Batch-specific notices (optional)
- Date-based notices

### 5.2 Future Communication (Phase 2)
- SMS notifications (optional)
- WhatsApp integration (optional)

---

## 6. Technical Requirements

### 6.1 Platform
- **Web-based LMS** (no mobile app in Phase 1)
- Responsive design for mobile and desktop
- Progressive Web App (PWA) capabilities

### 6.2 Storage & Media
- **Supabase Storage**: PDF files and documents
- **Cloudinary**: Image hosting and optimization
- **YouTube**: Unlisted videos for recorded lectures (iframe embed)

### 6.3 Device Compatibility
- ✅ Mobile phones (Android/iOS)
- ✅ Laptops/Desktops
- ✅ Tablets

### 6.3 Performance Requirements
- **Low internet usage** - Optimized for slow connections
- **Fast loading** - Pages load under 3 seconds
- **Offline support** - Downloaded content accessible offline
- **Lightweight** - Minimal data consumption

### 6.4 Hosting & Infrastructure
- Simple, affordable hosting
- Scalable for up to 500-1000 students
- Regular backups
- 99% uptime

### 6.5 Browser Support
- Chrome (primary)
- Firefox
- Safari
- Edge

---

## 7. Non-Functional Requirements

### 7.1 Usability
- Intuitive navigation
- Minimal clicks to reach content
- Clear labeling in both languages
- Help documentation

### 7.2 Security
- Secure login (username/password)
- Role-based access control
- Data encryption
- Regular security updates

### 7.3 Scalability
- Support for 500+ students
- Handle 50+ concurrent users
- Expandable storage for content

### 7.4 Reliability
- 99% uptime
- Daily backups
- Quick recovery from failures

---

## 8. Out of Scope (Phase 1)

### Not Included:
- ❌ Live streaming classes
- ❌ Video conferencing
- ❌ Mobile app (native)
- ❌ Advanced analytics
- ❌ Payment gateway
- ❌ Automated SMS/WhatsApp
- ❌ Parent portal
- ❌ Discussion forums
- ❌ Gamification features

---

## 9. Success Criteria

### 9.1 Functional Success
- ✅ All core features working
- ✅ Bilingual support functional
- ✅ Content upload/download working
- ✅ Tests and attendance operational

### 9.2 User Adoption
- ✅ 80% teacher adoption in first month
- ✅ 90% student usage within 2 months
- ✅ Positive user feedback

### 9.3 Performance
- ✅ Page load time < 3 seconds
- ✅ 99% uptime
- ✅ Low data usage (< 5MB per session)

---

## 10. Implementation Phases

### Phase 1: Core Features (Priority)
1. User management (students, teachers, admin)
2. Batch and course setup
3. Content sharing (PDF/images)
4. Basic attendance
5. Simple tests (MCQ)
6. Student dashboard
7. Bilingual support

### Phase 2: Enhancements
1. Homework submissions
2. Offline test mark upload
3. Advanced reports
4. Video content support

### Phase 3: Future Additions
1. SMS/WhatsApp notifications
2. Parent portal
3. Mobile app
4. Advanced analytics

---

## 11. Assumptions & Constraints

### Assumptions
- Teachers have basic computer/smartphone skills
- Students have access to smartphones or computers
- Internet connectivity available (even if slow)
- Admin will manage all student registrations

### Constraints
- Budget-friendly solution required
- Simple, non-technical interface needed
- Low bandwidth environment
- Limited technical support available

---

## 12. Glossary

| Term | Definition |
|------|------------|
| **Batch** | A group of students studying together (e.g., Class 10) |
| **Chapter** | A unit of study within a subject |
| **MCQ** | Multiple Choice Question |
| **Admin** | System administrator/coaching center owner |
| **Tier-3 City** | Smaller cities with limited infrastructure |
| **Offline Coaching** | Traditional classroom-based teaching |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-20 | Development Team | Initial requirements document |

---

**End of Requirements Document**
