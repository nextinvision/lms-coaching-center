# 🚀 Setup Guide - LMS Coaching Center

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

#### Required Environment Variables:

**Database (PostgreSQL)**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/lms_coaching?schema=public"
```

**Clerk Authentication**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your keys:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Cloudinary (File Storage)**
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Get your credentials:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create a database:
```sql
CREATE DATABASE lms_coaching;
```

#### Option B: Cloud Database (Recommended)
- **Supabase** (Free tier): https://supabase.com
- **Railway**: https://railway.app
- **Render**: https://render.com

#### Initialize Database
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio to view/edit data
npm run db:studio
```

### 4. Clerk Webhook Setup

1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `http://localhost:3000/api/webhooks/clerk`
3. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Copy the webhook secret to `.env.local`:
```env
CLERK_WEBHOOK_SECRET=whsec_...
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
lms-coaching-center/
├── app/                      # Next.js App Router
│   ├── (admin)/             # Admin routes (protected)
│   │   └── admin/
│   ├── (teacher)/           # Teacher routes (protected)
│   │   └── teacher/
│   ├── (student)/           # Student routes (protected)
│   │   └── dashboard/
│   ├── api/                 # API routes
│   │   ├── students/
│   │   ├── batches/
│   │   ├── content/
│   │   ├── attendance/
│   │   ├── tests/
│   │   ├── assignments/
│   │   └── notices/
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── ui/                 # Reusable UI components
│   ├── admin/              # Admin-specific components
│   ├── teacher/            # Teacher-specific components
│   ├── student/            # Student-specific components
│   └── shared/            # Shared components
├── lib/                    # Utility libraries
│   ├── prisma.ts          # Prisma client singleton
│   ├── auth.ts            # Auth utilities
│   ├── cloudinary.ts      # File upload utilities
│   ├── utils.ts           # General utilities
│   └── validations.ts     # Zod schemas
├── prisma/
│   └── schema.prisma      # Database schema
├── types/                 # TypeScript types
└── public/               # Static files
```

## Next Steps

1. **Create Admin User**
   - Sign up via Clerk
   - Update user role to ADMIN in database:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

2. **Create Academic Year**
   - Use Prisma Studio or API to create academic year
   - Example: "2024-2025"

3. **Create Batches**
   - Use admin panel to create batches
   - Example: "Class 8", "Class 9", "Class 10"

4. **Assign Teachers**
   - Create teacher accounts
   - Assign teachers to batches

5. **Add Students**
   - Use admin panel to add students
   - Assign students to batches

## Development Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema changes
npm run db:migrate       # Create migration
npm run db:studio        # Open Prisma Studio

# Build
npm run build            # Build for production
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### Clerk Authentication Issues
- Verify Clerk keys in `.env.local`
- Check webhook configuration
- Ensure webhook secret is set

### Cloudinary Upload Issues
- Verify Cloudinary credentials
- Check file size limits
- Ensure CORS is configured

### Prisma Issues
- Run `npm run db:generate` after schema changes
- Clear `.next` folder: `rm -rf .next`
- Restart dev server

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

