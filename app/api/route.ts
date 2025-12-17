import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'LMS Coaching Center API is running',
    version: '1.0.0',
  })
}

