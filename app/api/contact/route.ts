import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to Firebase Firestore
    // 2. Send an email notification
    // For now, we'll just log and return success

    console.log('Contact form submission:', { name, email, message });

    // TODO: Add Firebase integration
    // import { db } from '@/lib/firebase';
    // import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
    //
    // await addDoc(collection(db, 'contacts'), {
    //   name,
    //   email,
    //   message,
    //   createdAt: serverTimestamp(),
    //   read: false,
    // });

    return NextResponse.json(
      { success: true, message: 'Message received' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
