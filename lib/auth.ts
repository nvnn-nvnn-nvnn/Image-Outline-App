import { NextApiRequest } from 'next';
import admin from 'firebase-admin';

// Initialize Firebase Admin (do this once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export interface AuthUser {
  id: string;
  email: string;
  subscription: 'free' | 'pro';
}

export const getUserFromToken = async (req: NextApiRequest): Promise<AuthUser | null> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Get user from your database using Firebase UID
    const user = await db.user.findUnique({
      where: { firebaseUid: decodedToken.uid }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      subscription: user.subscription as 'free' | 'pro',
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};