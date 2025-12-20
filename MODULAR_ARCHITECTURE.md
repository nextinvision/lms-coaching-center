# LMS Modular Architecture (Feature-Based)
## Improved Structure for Scalability & Maintainability

---

## 🎯 Modular Design Principles

1. **Feature-First Organization** - Group by feature, not by type
2. **Self-Contained Modules** - Each module has its own components, hooks, types
3. **Clear Boundaries** - Modules communicate through well-defined interfaces
4. **Reusability** - Shared code in common modules
5. **Scalability** - Easy to add/remove features

---

## 📁 Improved Modular Structure

```
lms-coaching-center/
│
├── 📁 src/                                    # Source code
│   │
│   ├── 📁 app/                                # Next.js App Router (Routes Only)
│   │   ├── 📁 (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── 📁 (dashboard)/
│   │   │   ├── student/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── notes/page.tsx
│   │   │   │   ├── tests/page.tsx
│   │   │   │   └── [...other routes]
│   │   │   ├── teacher/[...routes]
│   │   │   ├── admin/[...routes]
│   │   │   └── layout.tsx
│   │   │
│   │   ├── 📁 api/                            # API Routes (Thin Controllers)
│   │   │   ├── auth/[...routes]
│   │   │   ├── students/[...routes]
│   │   │   ├── content/[...routes]
│   │   │   └── [...other routes]
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── 📁 modules/                            # Feature Modules (Core)
│   │   │
│   │   ├── 📁 auth/                           # Authentication Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── LanguageSelector.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useLogin.ts
│   │   │   │   └── useSession.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── authService.ts            # Business logic
│   │   │   │   └── sessionService.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── authStore.ts              # Zustand store
│   │   │   ├── 📁 types/
│   │   │   │   └── auth.types.ts
│   │   │   ├── 📁 utils/
│   │   │   │   ├── validation.ts
│   │   │   │   └── permissions.ts
│   │   │   └── index.ts                      # Public API
│   │   │
│   │   ├── 📁 students/                       # Student Management Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── StudentDashboard.tsx
│   │   │   │   ├── StudentProfile.tsx
│   │   │   │   ├── StudentForm.tsx
│   │   │   │   └── StudentList.tsx
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
│   │   ├── 📁 content/                        # Content Management Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── ContentList.tsx
│   │   │   │   ├── ContentCard.tsx
│   │   │   │   ├── ContentUpload.tsx
│   │   │   │   ├── FileViewer.tsx
│   │   │   │   └── ChapterOrganizer.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useContent.ts
│   │   │   │   ├── useFileUpload.ts
│   │   │   │   └── useContentByBatch.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── contentService.ts
│   │   │   │   ├── fileService.ts            # Supabase storage
│   │   │   │   └── contentValidation.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── contentStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── content.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 tests/                          # Test & Exam Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── TestList.tsx
│   │   │   │   ├── TestCard.tsx
│   │   │   │   ├── TestCreator.tsx
│   │   │   │   ├── QuestionForm.tsx
│   │   │   │   ├── TestTaker.tsx
│   │   │   │   └── TestResults.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useTest.ts
│   │   │   │   ├── useTestSubmission.ts
│   │   │   │   └── useTestResults.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── testService.ts
│   │   │   │   ├── questionService.ts
│   │   │   │   └── gradingService.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── testStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── test.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 homework/                       # Homework Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── HomeworkList.tsx
│   │   │   │   ├── HomeworkCard.tsx
│   │   │   │   ├── HomeworkForm.tsx
│   │   │   │   └── SubmissionViewer.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useHomework.ts
│   │   │   │   └── useSubmission.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── homeworkService.ts
│   │   │   │   └── submissionService.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── homeworkStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── homework.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 attendance/                     # Attendance Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── AttendanceMarker.tsx
│   │   │   │   ├── AttendanceChart.tsx
│   │   │   │   ├── AttendanceReport.tsx
│   │   │   │   └── AttendanceCalendar.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useAttendance.ts
│   │   │   │   └── useAttendanceStats.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── attendanceService.ts
│   │   │   │   └── attendanceCalculation.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── attendanceStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── attendance.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 batches/                        # Batch Management Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── BatchList.tsx
│   │   │   │   ├── BatchCard.tsx
│   │   │   │   ├── BatchForm.tsx
│   │   │   │   └── BatchAssignment.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useBatch.ts
│   │   │   │   └── useBatchStudents.ts
│   │   │   ├── 📁 services/
│   │   │   │   └── batchService.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── batchStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── batch.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 notices/                        # Notice Board Module
│   │   │   ├── 📁 components/
│   │   │   │   ├── NoticeBoard.tsx
│   │   │   │   ├── NoticeCard.tsx
│   │   │   │   └── NoticeForm.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   └── useNotices.ts
│   │   │   ├── 📁 services/
│   │   │   │   └── noticeService.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── noticeStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── notice.types.ts
│   │   │   └── index.ts
│   │   │
│   │   └── 📁 reports/                        # Reports Module
│   │       ├── 📁 components/
│   │       │   ├── ReportsDashboard.tsx
│   │       │   ├── AttendanceReport.tsx
│   │       │   └── PerformanceReport.tsx
│   │       ├── 📁 hooks/
│   │       │   └── useReports.ts
│   │       ├── 📁 services/
│   │       │   └── reportService.ts
│   │       ├── 📁 types/
│   │       │   └── report.types.ts
│   │       └── index.ts
│   │
│   ├── 📁 shared/                             # Shared/Common Code
│   │   ├── 📁 components/                     # Reusable UI Components
│   │   │   ├── 📁 ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Tabs.tsx
│   │   │   │   └── FileUpload.tsx
│   │   │   ├── 📁 layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── DashboardLayout.tsx
│   │   │   └── 📁 feedback/
│   │   │       ├── Loader.tsx
│   │   │       ├── Alert.tsx
│   │   │       └── Toast.tsx
│   │   │
│   │   ├── 📁 hooks/                          # Common Hooks
│   │   │   ├── useDebounce.ts
│   │   │   ├── usePagination.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useMediaQuery.ts
│   │   │
│   │   ├── 📁 utils/                          # Utility Functions
│   │   │   ├── date.ts
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── 📁 types/                          # Shared Types
│   │   │   ├── common.types.ts
│   │   │   └── api.types.ts
│   │   │
│   │   └── 📁 config/
│   │       ├── site.ts
│   │       ├── roles.ts
│   │       └── permissions.ts
│   │
│   ├── 📁 core/                               # Core Infrastructure
│   │   ├── 📁 database/
│   │   │   ├── prisma.ts                      # Prisma client
│   │   │   └── supabase.ts                    # Supabase client
│   │   │
│   │   ├── 📁 api/
│   │   │   ├── client.ts                      # API client
│   │   │   ├── middleware.ts                  # API middleware
│   │   │   └── errorHandler.ts
│   │   │
│   │   ├── 📁 i18n/
│   │   │   ├── config.ts
│   │   │   ├── translations/
│   │   │   │   ├── en.json
│   │   │   │   └── as.json
│   │   │   └── useTranslation.ts
│   │   │
│   │   └── 📁 storage/
│   │       ├── fileStorage.ts                 # File upload/download
│   │       └── cacheStorage.ts
│   │
│   └── 📁 lib/                                # External Libraries Config
│       ├── prisma.ts
│       ├── supabase.ts
│       └── utils.ts
│
├── 📁 prisma/                                 # Database
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── 📁 public/                                 # Static Assets
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

## 🏗️ Module Structure Template

Each module follows this pattern:

```
📁 module-name/
├── 📁 components/          # UI components for this feature
│   ├── ComponentA.tsx
│   └── ComponentB.tsx
├── 📁 hooks/              # Custom hooks for this feature
│   ├── useFeature.ts
│   └── useFeatureData.ts
├── 📁 services/           # Business logic & API calls
│   ├── featureService.ts
│   └── featureValidation.ts
├── 📁 store/              # State management (Zustand)
│   └── featureStore.ts
├── 📁 types/              # TypeScript types
│   └── feature.types.ts
├── 📁 utils/              # Feature-specific utilities (optional)
│   └── helpers.ts
└── index.ts               # Public API (exports)
```

---

## 📦 Example: Content Module

### File: `src/modules/content/index.ts`
```typescript
// Public API - Only export what other modules need
export { ContentList, ContentCard, ContentUpload } from './components';
export { useContent, useFileUpload } from './hooks';
export { contentService } from './services';
export type { Content, ContentType, UploadOptions } from './types';
```

### File: `src/modules/content/services/contentService.ts`
```typescript
import { prisma } from '@/core/database/prisma';
import { fileStorage } from '@/core/storage/fileStorage';
import type { Content, CreateContentDTO } from '../types';

export const contentService = {
  async getByBatch(batchId: string): Promise<Content[]> {
    return prisma.content.findMany({
      where: { batchId, isActive: true },
      include: { subject: true, teacher: true }
    });
  },

  async create(data: CreateContentDTO): Promise<Content> {
    // Upload file to Supabase
    const fileUrl = await fileStorage.upload(data.file);
    
    // Save to database
    return prisma.content.create({
      data: {
        ...data,
        fileUrl,
        fileName: data.file.name,
        fileSize: data.file.size
      }
    });
  },

  async delete(id: string): Promise<void> {
    const content = await prisma.content.findUnique({ where: { id } });
    if (content) {
      await fileStorage.delete(content.fileUrl);
      await prisma.content.delete({ where: { id } });
    }
  }
};
```

### File: `src/modules/content/hooks/useContent.ts`
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { contentService } from '../services';
import type { Content } from '../types';

export function useContent(batchId: string) {
  return useQuery({
    queryKey: ['content', batchId],
    queryFn: () => contentService.getByBatch(batchId)
  });
}

export function useCreateContent() {
  return useMutation({
    mutationFn: contentService.create,
    onSuccess: () => {
      // Invalidate cache, show toast, etc.
    }
  });
}
```

### File: `src/modules/content/components/ContentList.tsx`
```typescript
import { useContent } from '../hooks';
import { ContentCard } from './ContentCard';

export function ContentList({ batchId }: { batchId: string }) {
  const { data: content, isLoading } = useContent(batchId);

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {content?.map(item => (
        <ContentCard key={item.id} content={item} />
      ))}
    </div>
  );
}
```

---

## 🔄 Module Communication

### ✅ Good: Through Public APIs
```typescript
// In student dashboard
import { ContentList } from '@/modules/content';
import { TestCard } from '@/modules/tests';
import { NoticeBoard } from '@/modules/notices';

export function StudentDashboard() {
  return (
    <>
      <ContentList batchId={batchId} />
      <TestCard />
      <NoticeBoard />
    </>
  );
}
```

### ❌ Bad: Direct Internal Access
```typescript
// DON'T DO THIS
import { contentService } from '@/modules/content/services/contentService';
```

---

## 🎯 Benefits of This Modular Structure

### 1. **Scalability**
- Easy to add new features as modules
- Can split modules into separate packages later

### 2. **Maintainability**
- Each module is self-contained
- Changes in one module don't affect others
- Easy to locate code

### 3. **Testability**
- Test modules in isolation
- Mock dependencies easily

### 4. **Team Collaboration**
- Different developers can work on different modules
- Clear ownership boundaries

### 5. **Code Reusability**
- Modules export only what's needed
- Shared code in `shared/` folder

### 6. **Performance**
- Tree-shaking works better
- Can lazy-load modules

---

## 📋 Migration from Current Structure

### Step 1: Create Module Folders
```bash
mkdir -p src/modules/{auth,students,content,tests,homework,attendance,batches,notices,reports}
```

### Step 2: Move Components
```bash
# Move student components to student module
mv components/student/* src/modules/students/components/

# Move teacher components to respective modules
mv components/teacher/ContentUploadForm.tsx src/modules/content/components/
mv components/teacher/TestCreationForm.tsx src/modules/tests/components/
```

### Step 3: Create Services
Extract business logic from API routes into services

### Step 4: Update Imports
Update all imports to use module exports

---

## 🔧 Configuration Updates

### tsconfig.json - Path Aliases
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

## 📝 Summary

### Current Structure:
```
✅ Organized by type (components, api, hooks)
❌ Not feature-based
❌ Business logic scattered
```

### Modular Structure:
```
✅ Organized by feature (modules)
✅ Self-contained modules
✅ Clear boundaries
✅ Better scalability
✅ Easier maintenance
```

**Recommendation**: Migrate to the modular structure for long-term maintainability and scalability.

---

**End of Modular Architecture Document**
