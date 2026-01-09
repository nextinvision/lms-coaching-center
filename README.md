# LMS Coaching Center

A comprehensive Learning Management System designed for offline coaching centers in tier-3 cities with bilingual support (English + Assamese).

## Features

### Core Features
- ✅ **Student Management** - Complete student lifecycle management
- ✅ **Batch & Subject Management** - Organize classes and subjects
- ✅ **Content Management** - Upload and share PDFs, images, and videos
- ✅ **Test & Assessment** - Create and take online tests with auto-grading
- ✅ **Attendance Tracking** - Daily attendance marking and reports
- ✅ **Homework System** - Assign and submit homework assignments
- ✅ **Notice Board** - Important announcements and updates
- ✅ **Reports** - Comprehensive attendance and performance reports
- ✅ **Teacher Management** - Manage teachers and assignments
- ✅ **Academic Year Management** - Organize by academic years

### Technical Features
- ✅ **Authentication** - JWT-based secure authentication
- ✅ **Role-Based Access Control** - Student, Teacher, Admin roles
- ✅ **Bilingual Support** - English and Assamese
- ✅ **Responsive Design** - Works on mobile and desktop
- ✅ **File Storage** - MinIO for all file types (PDFs, images, videos)
- ✅ **Performance Optimized** - Code splitting, lazy loading, caching
- ✅ **Security** - Rate limiting, CSRF protection, input sanitization
- ✅ **Error Handling** - Comprehensive error logging and handling

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Local or any PostgreSQL instance)
- **ORM:** Prisma
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **File Storage:** MinIO (Local S3-compatible storage)
- **Authentication:** JWT
- **Validation:** Zod

## Getting Started

### Prerequisites

- Node.js 20.16.0 or higher
- Docker and Docker Compose (for local PostgreSQL and MinIO)
- PostgreSQL database (local or remote)
- MinIO (S3-compatible storage, included in docker-compose)

> **Note:** For local development, see [SETUP.md](./SETUP.md) for detailed setup instructions using Docker Compose.

### Quick Start (Local Development)

1. Clone the repository:
```bash
git clone <repository-url>
cd lms-coaching-center
```

2. Start PostgreSQL and MinIO with Docker Compose:
```bash
docker-compose up -d
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
cp .env.example .env
```

5. Set up database:
```bash
npm run db:migrate
npm run db:seed
```

6. Run development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Auth routes
│   ├── (dashboard)/       # Dashboard routes
│   └── api/               # API routes
├── modules/               # Feature modules
│   ├── auth/             # Authentication
│   ├── students/         # Student management
│   ├── batches/          # Batch management
│   ├── content/          # Content management
│   ├── tests/            # Test system
│   ├── attendance/       # Attendance tracking
│   ├── homework/         # Homework system
│   ├── notices/          # Notice board
│   ├── teachers/         # Teacher management
│   ├── academic-years/    # Academic year management
│   └── reports/          # Reports
├── shared/               # Shared components and utilities
│   ├── components/       # UI components
│   ├── hooks/            # Custom hooks
│   └── utils/            # Utilities
└── core/                 # Core functionality
    ├── api/              # API utilities
    ├── database/         # Database utilities
    ├── middleware/       # Middleware
    └── utils/            # Core utilities
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database

## Documentation

- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [User Guide](./USER_GUIDE.md)
- [Architecture](./ARCHITECTURE.md)
- [Implementation Plan](./IMPLEMENTATION_PLAN.md)

## Security

- Rate limiting on all endpoints
- CSRF protection for state-changing requests
- Input sanitization
- Secure file uploads
- JWT-based authentication
- Role-based access control

## Performance

- Code splitting and lazy loading
- Image optimization (can be enhanced with external image processing service)
- Database query optimization
- Caching strategies
- Pagination for large lists

## Testing

- Unit tests for services
- Integration tests for API routes
- Component tests
- E2E tests for critical flows

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Recommended platforms:
- **Vercel** (Recommended for Next.js)
- **Railway**
- **Render**

For local deployment, see [SETUP.md](./SETUP.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

[Your License Here]

## Support

For support, email support@example.com or open an issue in the repository.

## Acknowledgments

- Next.js team
- Prisma team
- All contributors

