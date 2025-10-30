
'use client';
import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import type { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // In a Next.js development environment, this will be caught by the dev overlay
      // In production, you might want to log this to a service like Sentry
      if (process.env.NODE_ENV === 'development') {
        throw error;
      } else {
        console.error("A Firestore permission error occurred:", error.message);
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  return null;
}
