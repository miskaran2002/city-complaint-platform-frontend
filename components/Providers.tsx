// components/Providers.tsx
'use client';

import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }: { children: React.ReactNode }) {
  // .env.local should contain NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}