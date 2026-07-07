import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json(); // Contains firstName, lastName, email, subject, message

    // Forward to WordPress backend securely using environment variables
    const wpResponse = await fetch(`${process.env.WC_BASE_URL}/wp-json/hod/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await wpResponse.json();

    if (!wpResponse.ok) {
      throw new Error(data.message || 'Failed to submit contact form');
    }

    return NextResponse.json({ success: true, message: data.message });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
