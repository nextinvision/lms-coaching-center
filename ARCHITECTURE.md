# LMS Feature-Based Modular Architecture
## Industry-Level Professional Structure

**Tech Stack:**
- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Language**: TypeScript

---

## 🎯 Architecture Principles

1. **Feature-First Organization** - Group by domain/feature, not by technical type
2. **Self-Contained Modules** - Each module owns its components, hooks, services, types
3. **Clear Module Boundaries** - Modules communicate through well-defined public APIs
4. **Separation of Concerns** - Presentation, business logic, and data access are separated
5. **Scalability & Maintainability** - Easy to add, modify, or remove features

---

## 📁 Complete Directory Structure

```
lms-coaching-center/
│
├── 📁 src/                                    # Source code root
│   │
│   ├── 📁 app/                                # Next.js App Router (Routes Only)
│   │   ├── 📁 (auth)/                        # Auth routes group
│   │   │   ├── login/page.tsx
│   │   │   ├── language-select/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── 📁 (dashboard)/                   # Dashboard routes group
│   │   │   ├── 📁 student/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── notes/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── tests/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/page.tsx
│   │   │   │   │   └── results/[id]/page.tsx
│   │   │   │   ├── homework/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── attendance/page.tsx
│   │   │   │   └── profile/page.tsx
│   │   │   │
│   │   │   ├── 📁 teacher/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── content/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── upload/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── tests/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── create/page.tsx
│   │   │   │   │   ├── [id]/page.tsx
│   │   │   │   │   └── [id]/results/page.tsx
│   │   │   │   ├── attendance/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── reports/page.tsx
│   │   │   │   ├── homework/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── create/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   └── students/page.tsx
│   │   │   │
│   │   │   ├── 📁 admin/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── students/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── add/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── teachers/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── add/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── batches/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── create/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── subjects/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── create/page.tsx
│   │   │   │   ├── notices/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── create/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   └── reports/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── attendance/page.tsx
│   │   │   │       └── performance/page.tsx
│   │   │   │
│   │   │   └── layout.tsx
│   │   │
│   │   ├── 📁 api/                           # API Routes (Thin Controllers)
│   │   │   ├── 📁 auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   └── me/route.ts
│   │   │   ├── 📁 students/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── batch/[batchId]/route.ts
│   │   │   ├── 📁 teachers/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── 📁 batches/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/route.ts
│   │   │   │   ├── [id]/students/route.ts
│   │   │   │   └── [id]/subjects/route.ts
│   │   │   ├── 📁 subjects/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── 📁 content/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/route.ts
│   │   │   │   ├── upload/route.ts
│   │   │   │   └── batch/[batchId]/route.ts
│   │   │   ├── 📁 tests/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/route.ts
│   │   │   │   ├── [id]/submit/route.ts
│   │   │   │   ├── [id]/results/route.ts
│   │   │   │   └── upload-marks/route.ts
│   │   │   ├── 📁 homework/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/route.ts
│   │   │   │   ├── [id]/submit/route.ts
│   │   │   │   └── batch/[batchId]/route.ts
│   │   │   ├── 📁 attendance/
│   │   │   │   ├── route.ts
│   │   │   │   ├── mark/route.ts
│   │   │   │   ├── student/[studentId]/route.ts
│   │   │   │   └── batch/[batchId]/route.ts
│   │   │   ├── 📁 notices/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   └── 📁 reports/
│   │   │       ├── attendance/route.ts
│   │   │       └── performance/route.ts
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── 📁 modules/                           # Feature Modules (CORE)
│   │   │
│   │   ├── 📁 auth/                          # Authentication Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── LanguageSelector.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useLogin.ts
│   │   │   │   └── useSession.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── authService.ts
│   │   │   │   └── sessionService.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── authStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── auth.types.ts
│   │   │   ├── 📁 utils/
│   │   │   │   ├── validation.ts
│   │   │   │   └── permissions.ts
│   │   │   └── index.ts                      # Public API
│   │   │
│   │   ├── 📁 students/                      # Student Management Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── StudentDashboard.tsx
│   │   │   │   ├── StudentProfile.tsx
│   │   │   │   ├── StudentForm.tsx
│   │   │   │   ├── StudentList.tsx
│   │   │   │   ├── StudentTable.tsx
│   │   │   │   └── StudentStats.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useStudent.ts
│   │   │   │   ├── useStudents.ts
│   │   │   │   └── useStudentStats.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── studentService.ts
│   │   │   │   └── studentValidation.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── studentStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── student.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 teachers/                      # Teacher Management Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── TeacherDashboard.tsx
│   │   │   │   ├── TeacherProfile.tsx
│   │   │   │   ├── TeacherForm.tsx
│   │   │   │   ├── TeacherList.tsx
│   │   │   │   └── TeacherStats.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useTeacher.ts
│   │   │   │   └── useTeachers.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── teacherService.ts
│   │   │   │   └── teacherValidation.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── teacherStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── teacher.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 content/                       # Content Management Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── ContentList.tsx
│   │   │   │   ├── ContentCard.tsx
│   │   │   │   ├── ContentUpload.tsx
│   │   │   │   ├── FileViewer.tsx
│   │   │   │   ├── PDFViewer.tsx
│   │   │   │   ├── VideoPlayer.tsx
│   │   │   │   └── ChapterOrganizer.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useContent.ts
│   │   │   │   ├── useFileUpload.ts
│   │   │   │   └── useContentByBatch.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── contentService.ts
│   │   │   │   ├── fileService.ts
│   │   │   │   └── contentValidation.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── contentStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── content.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 tests/                         # Test & Exam Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── TestList.tsx
│   │   │   │   ├── TestCard.tsx
│   │   │   │   ├── TestCreator.tsx
│   │   │   │   ├── QuestionForm.tsx
│   │   │   │   ├── QuestionBuilder.tsx
│   │   │   │   ├── TestTaker.tsx
│   │   │   │   ├── TestResults.tsx
│   │   │   │   └── MarksUploader.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useTest.ts
│   │   │   │   ├── useTestSubmission.ts
│   │   │   │   ├── useTestResults.ts
│   │   │   │   └── useTestTimer.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── testService.ts
│   │   │   │   ├── questionService.ts
│   │   │   │   ├── gradingService.ts
│   │   │   │   └── testValidation.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── testStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── test.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 homework/                      # Homework Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── HomeworkList.tsx
│   │   │   │   ├── HomeworkCard.tsx
│   │   │   │   ├── HomeworkForm.tsx
│   │   │   │   ├── SubmissionViewer.tsx
│   │   │   │   └── HomeworkStats.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useHomework.ts
│   │   │   │   ├── useSubmission.ts
│   │   │   │   └── useHomeworkByBatch.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── homeworkService.ts
│   │   │   │   ├── submissionService.ts
│   │   │   │   └── homeworkValidation.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── homeworkStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── homework.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 attendance/                    # Attendance Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── AttendanceMarker.tsx
│   │   │   │   ├── AttendanceSheet.tsx
│   │   │   │   ├── AttendanceChart.tsx
│   │   │   │   ├── AttendanceReport.tsx
│   │   │   │   └── AttendanceCalendar.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useAttendance.ts
│   │   │   │   ├── useAttendanceStats.ts
│   │   │   │   └── useAttendanceByBatch.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── attendanceService.ts
│   │   │   │   ├── attendanceCalculation.ts
│   │   │   │   └── attendanceValidation.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── attendanceStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── attendance.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 batches/                       # Batch Management Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── BatchList.tsx
│   │   │   │   ├── BatchCard.tsx
│   │   │   │   ├── BatchForm.tsx
│   │   │   │   ├── BatchAssignment.tsx
│   │   │   │   └── BatchDetails.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useBatch.ts
│   │   │   │   ├── useBatches.ts
│   │   │   │   └── useBatchStudents.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── batchService.ts
│   │   │   │   └── batchValidation.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── batchStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── batch.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 subjects/                      # Subject Management Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── SubjectList.tsx
│   │   │   │   ├── SubjectCard.tsx
│   │   │   │   └── SubjectForm.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useSubject.ts
│   │   │   │   └── useSubjects.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── subjectService.ts
│   │   │   │   └── subjectValidation.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── subjectStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── subject.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 notices/                       # Notice Board Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── NoticeBoard.tsx
│   │   │   │   ├── NoticeCard.tsx
│   │   │   │   ├── NoticeForm.tsx
│   │   │   │   └── NoticeList.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useNotices.ts
│   │   │   │   └── useNotice.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── noticeService.ts
│   │   │   │   └── noticeValidation.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── noticeStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── notice.types.ts
│   │   │   └── index.ts
│   │   │
│   │   └── 📁 reports/                       # Reports Module
│   │       ├── 📁 components/
│   │       │   ├── ReportsDashboard.tsx
│   │       │   ├── AttendanceReport.tsx
│   │       │   ├── PerformanceReport.tsx
│   │       │   └── ExportButton.tsx
│   │       ├── 📁 hooks/
│   │       │   ├── useReports.ts
│   │       │   └── useExport.ts
│   │       ├── 📁 services/
│   │       │   ├── reportService.ts
│   │       │   └── exportService.ts
│   │       ├── 📁 types/
│   │       │   └── report.types.ts
│   │       └── index.ts
│   │
│   ├── 📁 shared/                            # Shared/Common Code
│   │   ├── 📁 components/                    # Reusable UI Components
│   │   │   ├── 📁 ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Textarea.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Checkbox.tsx
│   │   │   │   ├── Radio.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Dialog.tsx
│   │   │   │   ├── Dropdown.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Tabs.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Alert.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   ├── Progress.tsx
│   │   │   │   ├── Avatar.tsx
│   │   │   │   ├── Tooltip.tsx
│   │   │   │   └── FileUpload.tsx
│   │   │   ├── 📁 layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── DashboardLayout.tsx
│   │   │   │   └── Container.tsx
│   │   │   └── 📁 feedback/
│   │   │       ├── EmptyState.tsx
│   │   │       ├── ErrorBoundary.tsx
│   │   │       └── ConfirmDialog.tsx
│   │   │
│   │   ├── 📁 hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── usePagination.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   ├── useSearch.ts
│   │   │   └── useFilter.ts
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── date.ts
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   ├── constants.ts
│   │   │   ├── helpers.ts
│   │   │   └── cn.ts
│   │   │
│   │   ├── 📁 types/
│   │   │   ├── common.types.ts
│   │   │   └── api.types.ts
│   │   │
│   │   └── 📁 config/
│   │       ├── site.ts
│   │       ├── roles.ts
│   │       ├── permissions.ts
│   │       └── navigation.ts
│   │
│   ├── 📁 core/                              # Core Infrastructure
│   │   ├── 📁 database/
│   │   │   ├── prisma.ts
│   │   │   └── queries.ts
│   │   │
│   │   ├── 📁 storage/
│   │   │   ├── supabase.ts                   # Supabase Storage (PDFs)
│   │   │   ├── cloudinary.ts                 # Cloudinary (Images)
│   │   │   ├── youtube.ts                    # YouTube embed utilities
│   │   │   ├── fileUpload.ts
│   │   │   └── fileDownload.ts
│   │   │
│   │   ├── 📁 api/
│   │   │   ├── client.ts
│   │   │   ├── middleware.ts
│   │   │   └── errorHandler.ts
│   │   │
│   │   └── 📁 i18n/
│   │       ├── config.ts
│   │       ├── translations/
│   │       │   ├── en.json
│   │       │   └── as.json
│   │       └── useTranslation.ts
│   │
│   └── 📁 lib/                               # External Libraries Config
│       ├── prisma.ts
│       ├── supabase.ts
│       └── utils.ts
│
├── 📁 prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── 📁 public/
│   ├── images/
│   ├── icons/
│   └── locales/
│
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🏗️ Module Structure Pattern

Each module follows this consistent structure:

```
📁 module-name/
├── 📁 components/          # UI components for this feature
├── 📁 hooks/              # Custom hooks for this feature
├── 📁 services/           # Business logic & API calls
├── 📁 store/              # State management (Zustand)
├── 📁 types/              # TypeScript types
├── 📁 utils/              # Feature-specific utilities (optional)
└── index.ts               # Public API (exports only what's needed)
```

---

## � Module Communication Pattern

### ✅ Correct: Through Public APIs

```typescript
// src/modules/content/index.ts
export { ContentList, ContentCard, ContentUpload } from './components';
export { useContent, useFileUpload } from './hooks';
export { contentService } from './services';
export type { Content, ContentType } from './types';
```

```typescript
// Usage in pages or other modules
import { ContentList } from '@/modules/content';
import { TestCard } from '@/modules/tests';

export function StudentDashboard() {
  return (
    <>
      <ContentList batchId={batchId} />
      <TestCard />
    </>
  );
}
```

### ❌ Incorrect: Direct Internal Access

```typescript
// DON'T DO THIS
import { contentService } from '@/modules/content/services/contentService';
```

---

## 🎯 Benefits

1. **Scalability** - Easy to add new features as self-contained modules
2. **Maintainability** - Changes in one module don't affect others
3. **Testability** - Test modules in isolation
4. **Team Collaboration** - Different developers work on different modules
5. **Code Reusability** - Modules export only what's needed
6. **Performance** - Better tree-shaking and lazy loading

---

## 📦 TypeScript Path Aliases

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/modules/*": ["./src/modules/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/core/*": ["./src/core/*"]
    }
  }
}
```

---

**This is an industry-standard feature-based modular architecture for scalable applications.**
