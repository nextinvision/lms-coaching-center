// Old sign-up route - placeholder
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json(
    { success: false, error: 'Sign-up not implemented yet' },
    { status: 501 }
  );
}
