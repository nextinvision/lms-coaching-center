# LMS Coaching Center

A comprehensive Learning Management System designed for offline coaching centers in Tier-3 cities.

## Features

- **Student Management**: Admin-controlled student creation and batch assignment
- **Batch System**: Organize students by classes (Class 8, 9, 10, etc.)
- **Content Sharing**: PDF notes, images, and recorded videos
- **Attendance Tracking**: Daily attendance with batch-wise management
- **Test System**: Practice, weekly, and monthly tests with auto-grading
- **Assignments**: Homework management with submission tracking
- **Multi-language**: English and Assamese support
- **Notice Board**: Important announcements and updates
- **Role-based Access**: Admin, Teacher, and Student dashboards

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **File Storage**: Cloudinary
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account
- Cloudinary account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd lms-coaching-center
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key
- `CLOUDINARY_*`: Cloudinary credentials

4. Set up the database
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
lms-coaching-center/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin routes
│   ├── (teacher)/         # Teacher routes
│   ├── (student)/         # Student routes
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # Authentication utilities
│   ├── cloudinary.ts      # File upload utilities
│   └── utils.ts           # General utilities
├── prisma/                # Database schema
│   └── schema.prisma      # Prisma schema
└── types/                 # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: Authentication and user profiles
- **Student**: Student information and batch assignment
- **Teacher**: Teacher profiles
- **Admin**: Admin profiles
- **Batch**: Class batches (Class 8, 9, 10, etc.)
- **Subject**: Subjects assigned to batches
- **Content**: PDFs, images, and videos
- **Attendance**: Daily attendance records
- **Test**: Tests and exams
- **Question**: Test questions
- **Assignment**: Homework assignments
- **Notice**: Announcements and notices

## Authentication

The application uses Clerk for authentication. User roles are managed in the database:

- **ADMIN**: Full system access
- **TEACHER**: Content, attendance, tests, assignments
- **STUDENT**: View content, take tests, submit assignments

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private - All rights reserved
