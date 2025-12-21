# Manual Testing Checklist
## Step-by-Step Testing Guide for Login and All Panels

Use this checklist to manually test all functionality.

---

## 🔐 Authentication Testing

### Test 1: Student Login
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Enter email: `student@example.com`
- [ ] Enter password: `password123`
- [ ] Click "Sign In"
- [ ] **Expected:** Redirect to `/student/dashboard`
- [ ] **Verify:** Dashboard loads with student information
- [ ] **Verify:** Sidebar shows student menu items
- [ ] **Verify:** Navbar shows student name

### Test 2: Teacher Login
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Enter email: `teacher@example.com`
- [ ] Enter password: `password123`
- [ ] Click "Sign In"
- [ ] **Expected:** Redirect to `/teacher/dashboard`
- [ ] **Verify:** Dashboard loads with teacher information
- [ ] **Verify:** Sidebar shows teacher menu items
- [ ] **Verify:** Navbar shows teacher name

### Test 3: Admin Login
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Enter email: `admin@example.com`
- [ ] Enter password: `password123`
- [ ] Click "Sign In"
- [ ] **Expected:** Redirect to `/admin/dashboard`
- [ ] **Verify:** Dashboard loads with admin information
- [ ] **Verify:** Sidebar shows admin menu items
- [ ] **Verify:** Navbar shows admin name

### Test 4: Invalid Credentials
- [ ] Navigate to `/login`
- [ ] Enter wrong email or password
- [ ] Click "Sign In"
- [ ] **Expected:** Error message displayed
- [ ] **Verify:** Not redirected
- [ ] **Verify:** Can try again

### Test 5: Logout
- [ ] Login as any role
- [ ] Click logout button in navbar
- [ ] **Expected:** Redirect to home page (`/`)
- [ ] **Verify:** Cannot access dashboard routes
- [ ] **Verify:** Redirected to login if trying to access dashboard

---

## 👨‍🎓 Student Panel Testing

### Dashboard (`/student/dashboard`)
- [ ] Login as Student
- [ ] **Verify:** Dashboard loads
- [ ] **Verify:** Shows attendance percentage
- [ ] **Verify:** Shows upcoming tests
- [ ] **Verify:** Shows recent notes
- [ ] **Verify:** Shows recent homework
- [ ] **Verify:** Shows important notices

### Notes (`/student/notes`)
- [ ] Navigate to Notes
- [ ] **Verify:** Content list loads
- [ ] **Verify:** Can filter by batch
- [ ] **Verify:** Can filter by subject
- [ ] **Verify:** Can search content
- [ ] Click on a content item
- [ ] **Verify:** Content detail page loads
- [ ] **Verify:** Can view PDF (if PDF)
- [ ] **Verify:** Can view image (if image)
- [ ] **Verify:** Can view video (if video)
- [ ] **Verify:** Can download files

### Tests (`/student/tests`)
- [ ] Navigate to Tests
- [ ] **Verify:** Test list loads
- [ ] **Verify:** Shows test status (upcoming, active, completed)
- [ ] **Verify:** Shows test details (duration, marks, date)
- [ ] Click on an available test
- [ ] **Verify:** Test taking page loads
- [ ] **Verify:** Timer is visible
- [ ] **Verify:** Questions are displayed
- [ ] Answer questions
- [ ] Submit test
- [ ] **Verify:** Redirected to results page
- [ ] **Verify:** Results show score
- [ ] **Verify:** Results show correct/incorrect answers

### Homework (`/student/homework`)
- [ ] Navigate to Homework
- [ ] **Verify:** Assignment list loads
- [ ] **Verify:** Shows due dates
- [ ] **Verify:** Shows submission status
- [ ] Click on an assignment
- [ ] **Verify:** Assignment detail page loads
- [ ] **Verify:** Can download assignment file
- [ ] Upload submission file
- [ ] Submit homework
- [ ] **Verify:** Status changes to "Submitted"
- [ ] **Verify:** Can view submission

### Attendance (`/student/attendance`)
- [ ] Navigate to Attendance
- [ ] **Verify:** Attendance history loads
- [ ] **Verify:** Shows attendance percentage
- [ ] **Verify:** Shows monthly summary
- [ ] **Verify:** Calendar view works
- [ ] **Verify:** Can filter by date range

### Notices (`/student/notices`)
- [ ] Navigate to Notices
- [ ] **Verify:** Notice board loads
- [ ] **Verify:** Shows all notices
- [ ] **Verify:** Important notices highlighted
- [ ] **Verify:** Can filter by type
- [ ] **Verify:** Can search notices

### Profile (`/student/profile`)
- [ ] Navigate to Profile
- [ ] **Verify:** Profile page loads
- [ ] **Verify:** Shows student information
- [ ] **Verify:** Shows batch information
- [ ] **Verify:** Shows academic details

---

## 👨‍🏫 Teacher Panel Testing

### Dashboard (`/teacher/dashboard`)
- [ ] Login as Teacher
- [ ] **Verify:** Dashboard loads
- [ ] **Verify:** Shows assigned batches count
- [ ] **Verify:** Shows content count
- [ ] **Verify:** Shows test count
- [ ] **Verify:** Quick action buttons work
- [ ] **Verify:** Recent notices displayed

### Content Management
- [ ] Navigate to Content (`/teacher/content`)
- [ ] **Verify:** Content list loads
- [ ] **Verify:** Can filter and search
- [ ] Navigate to Upload Content (`/teacher/content/upload`)
- [ ] **Verify:** Upload form loads
- [ ] Select batch and subject
- [ ] Upload a PDF file
- [ ] **Verify:** File uploads successfully
- [ ] **Verify:** Content appears in list
- [ ] Upload an image file
- [ ] **Verify:** Image uploads successfully
- [ ] Add YouTube video URL
- [ ] **Verify:** Video content created

### Test Management
- [ ] Navigate to Tests (`/teacher/tests`)
- [ ] **Verify:** Test list loads
- [ ] Navigate to Create Test (`/teacher/tests/create`)
- [ ] **Verify:** Test creation form loads
- [ ] Fill test details (title, duration, dates)
- [ ] Add questions (MCQ and Short Answer)
- [ ] Set correct answers
- [ ] Save test
- [ ] **Verify:** Test appears in list
- [ ] Click on test results
- [ ] **Verify:** Results page loads
- [ ] **Verify:** Shows student submissions
- [ ] **Verify:** Shows scores

### Attendance Management
- [ ] Navigate to Attendance (`/teacher/attendance`)
- [ ] **Verify:** Attendance page loads
- [ ] Select batch
- [ ] Select date
- [ ] **Verify:** Student list loads
- [ ] Mark students as Present/Absent
- [ ] Save attendance
- [ ] **Verify:** Attendance saved
- [ ] Navigate to Attendance Reports
- [ ] **Verify:** Reports page loads
- [ ] **Verify:** Can view statistics

### Homework Management
- [ ] Navigate to Homework (`/teacher/homework`)
- [ ] **Verify:** Assignment list loads
- [ ] Navigate to Create Homework (`/teacher/homework/create`)
- [ ] **Verify:** Creation form loads
- [ ] Fill assignment details
- [ ] Upload assignment file
- [ ] Set due date
- [ ] Save assignment
- [ ] **Verify:** Assignment appears in list
- [ ] Click on assignment
- [ ] **Verify:** Assignment detail page loads
- [ ] **Verify:** Shows student submissions
- [ ] **Verify:** Can download submissions
- [ ] **Verify:** Can mark as checked

### Notices
- [ ] Navigate to Notices (`/teacher/notices`)
- [ ] **Verify:** Notice board loads
- [ ] **Verify:** Can view all notices
- [ ] **Verify:** Can filter notices

---

## 👨‍💼 Admin Panel Testing

### Dashboard (`/admin/dashboard`)
- [ ] Login as Admin
- [ ] **Verify:** Dashboard loads
- [ ] **Verify:** Shows system statistics
- [ ] **Verify:** Shows student statistics
- [ ] **Verify:** Shows teacher statistics
- [ ] **Verify:** Shows active academic year
- [ ] **Verify:** Management cards are clickable

### Student Management
- [ ] Navigate to Students (`/admin/students`)
- [ ] **Verify:** Student list loads
- [ ] **Verify:** Can search students
- [ ] **Verify:** Can filter by batch
- [ ] Navigate to Add Student (`/admin/students/add`)
- [ ] **Verify:** Student creation form loads
- [ ] Fill student details
- [ ] Assign to batch
- [ ] Save student
- [ ] **Verify:** Student appears in list
- [ ] Click on student
- [ ] **Verify:** Student detail page loads
- [ ] **Verify:** Can edit student
- [ ] **Verify:** Can view statistics

### Teacher Management
- [ ] Navigate to Teachers (`/admin/teachers`)
- [ ] **Verify:** Teacher list loads
- [ ] **Verify:** Can search teachers
- [ ] Navigate to Add Teacher (`/admin/teachers/add`)
- [ ] **Verify:** Teacher creation form loads
- [ ] Fill teacher details
- [ ] Assign to batches
- [ ] Save teacher
- [ ] **Verify:** Teacher appears in list
- [ ] Click on teacher
- [ ] **Verify:** Teacher detail page loads
- [ ] **Verify:** Shows assigned batches
- [ ] **Verify:** Can edit teacher

### Batch Management
- [ ] Navigate to Batches (`/admin/batches`)
- [ ] **Verify:** Batch list loads
- [ ] Navigate to Create Batch (`/admin/batches/create`)
- [ ] **Verify:** Batch creation form loads
- [ ] Fill batch details
- [ ] Assign subjects
- [ ] Assign teachers
- [ ] Save batch
- [ ] **Verify:** Batch appears in list
- [ ] Click on batch
- [ ] **Verify:** Batch detail page loads
- [ ] **Verify:** Shows students
- [ ] **Verify:** Shows teachers
- [ ] **Verify:** Can edit batch

### Subject Management
- [ ] Navigate to Subjects (`/admin/subjects`)
- [ ] **Verify:** Subject list loads
- [ ] Navigate to Create Subject (`/admin/subjects/create`)
- [ ] **Verify:** Subject creation form loads
- [ ] Fill subject details
- [ ] Save subject
- [ ] **Verify:** Subject appears in list

### Notice Management
- [ ] Navigate to Notices (`/admin/notices`)
- [ ] **Verify:** Notice list loads
- [ ] Click "Create Notice"
- [ ] **Verify:** Notice creation form loads
- [ ] Fill notice details (English and Assamese)
- [ ] Set notice type and priority
- [ ] Set expiry date
- [ ] Save notice
- [ ] **Verify:** Notice appears in list
- [ ] Click on notice
- [ ] **Verify:** Notice detail page loads
- [ ] **Verify:** Can edit notice
- [ ] **Verify:** Can delete notice

### Academic Year Management
- [ ] Navigate to Academic Years (`/admin/academic-years`)
- [ ] **Verify:** Academic year list loads
- [ ] Click "Create Academic Year"
- [ ] **Verify:** Creation form loads
- [ ] Fill year details
- [ ] Set start/end dates
- [ ] Set as active
- [ ] Save academic year
- [ ] **Verify:** Year appears in list
- [ ] **Verify:** Active year is highlighted
- [ ] Click on year
- [ ] **Verify:** Year detail page loads

### Reports
- [ ] Navigate to Reports (`/admin/reports`)
- [ ] **Verify:** Reports dashboard loads
- [ ] **Verify:** Shows attendance reports tab
- [ ] **Verify:** Shows performance reports tab
- [ ] Select filters (batch, date range)
- [ ] **Verify:** Reports generate
- [ ] **Verify:** Can export reports (CSV, PDF, Excel)

---

## 🔒 Security Testing

### Test: Unauthorized Access
- [ ] Login as Student
- [ ] Try to access `/teacher/dashboard`
  - **Expected:** Redirect or "Access Denied" message
- [ ] Try to access `/admin/dashboard`
  - **Expected:** Redirect or "Access Denied" message
- [ ] **Verify:** Access is blocked

### Test: Unauthenticated Access
- [ ] Logout (or clear cookies)
- [ ] Try to access `/student/dashboard`
  - **Expected:** Redirect to `/login`
- [ ] Try to access `/teacher/dashboard`
  - **Expected:** Redirect to `/login`
- [ ] Try to access `/admin/dashboard`
  - **Expected:** Redirect to `/login`
- [ ] **Verify:** All protected routes redirect

### Test: Session Persistence
- [ ] Login as any role
- [ ] Refresh the page (F5)
- [ ] **Expected:** Still authenticated
- [ ] **Expected:** Still on correct dashboard
- [ ] **Verify:** Session persists

### Test: Token Expiry
- [ ] Login as any role
- [ ] Wait for token to expire (or manually expire)
- [ ] Try to access dashboard
- [ ] **Expected:** Redirect to `/login`
- [ ] **Verify:** Must login again

---

## ✅ Testing Summary

### Quick Test (5 minutes)
1. ✅ Login as Student → Verify dashboard loads
2. ✅ Login as Teacher → Verify dashboard loads
3. ✅ Login as Admin → Verify dashboard loads
4. ✅ Logout → Verify redirect to home
5. ✅ Try accessing protected route without login → Verify redirect

### Full Test (30 minutes)
- Complete all checklist items above
- Test all pages for each role
- Test all features
- Test security measures

---

## 🐛 If You Find Issues

1. **Note the issue:**
   - What page/feature
   - What you were doing
   - What error you saw

2. **Check console:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

3. **Report:**
   - Document the issue
   - Include screenshots if possible
   - Include console errors

---

**Last Updated:** January 2024


