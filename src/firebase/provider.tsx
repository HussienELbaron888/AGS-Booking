
'use client';

import { app, db, auth } from '@/lib/firebase';
import React, { createContext, useContext } from 'react';
import { FirebaseErrorListener } from '@/components/firebase-error-listener';

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <FirebaseContext.Provider value={null}>
      {children}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  return { app, db, auth };
};
