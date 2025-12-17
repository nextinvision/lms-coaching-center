import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            LMS Coaching Center
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Learning Management System for Offline Coaching Centers
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/sign-in"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Sign Up
              </Link>
            </div>

            <div className="mt-8 flex gap-4 justify-center flex-wrap">
              <Link
                href="/admin"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/teacher"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Teacher Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Student Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
