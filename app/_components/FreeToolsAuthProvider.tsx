'use client';

/**
 * T3 LABS DEMO PORT - demo FreeToolsAuthProvider.
 *
 * The supplier pricing tool was ported from quote-core.com, where free-tools
 * login is backed by Supabase. On t3labs.tech the demos are self-contained:
 * there is no real auth backend. This provider implements a local demo login:
 * any email/password combination (or the dedicated demo button) signs the
 * visitor in as a demo trade customer, persisted in sessionStorage so the
 * signed-in state survives navigation within the demo.
 *
 * If a future demo needs real auth, replace this file with a Supabase-backed
 * implementation matching FreeToolsAuthState (see the quotecore-plus master).
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';

export interface FreeToolsTierInfo {
  tier: 1 | 2 | 3;
  hasAppAccount: boolean;
  limits: { aiPerDay: number; docPerDay: number | null; imagePerDay: number; textPerDay: number; label: string };
}

export interface FreeToolsAuthTheme {
  accent: string;
  accentHover: string;
}

interface FreeToolsAuthState {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  tierInfo: FreeToolsTierInfo | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signInWithDemo: (email?: string) => void;
  signOut: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'signup' | 'signin') => void;
  closeAuthModal: () => void;
}

const STORAGE_KEY = 't3-demo-trade-user';

const FreeToolsAuthContext = createContext<FreeToolsAuthState | null>(null);

function demoUser(email: string): User {
  // Minimal shape of the Supabase User the tool components read (email etc.).
  return {
    id: `demo-${email}`,
    aud: 'authenticated',
    role: 'authenticated',
    email,
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { full_name: 'Demo Trade Customer' },
    created_at: new Date().toISOString(),
  } as unknown as User;
}

export function FreeToolsAuthProvider({
  children,
  authTheme,
}: {
  children: ReactNode;
  /** accepted for API parity with master; unused by this demo port */
  authTheme?: FreeToolsAuthTheme;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) setUser(demoUser(raw));
    } catch {
      // sessionStorage unavailable - stay anonymous
    }
  }, []);

  const persist = useCallback((email: string) => {
    setUser(demoUser(email));
    try {
      window.sessionStorage.setItem(STORAGE_KEY, email);
    } catch {
      // best effort
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    persist('demo.trade.customer@example.com');
  }, [persist]);

  const signInWithEmail = useCallback(async (email: string, _password: string) => {
    if (!email.trim()) return { error: 'Please enter your email address.' };
    persist(email.trim());
    return { error: null };
  }, [persist]);

  const signUpWithEmail = useCallback(
    async (email: string, _password: string): Promise<{ error: string | null; needsConfirmation: boolean }> => {
      if (!email.trim()) return { error: 'Please enter your email address.', needsConfirmation: false };
      persist(email.trim());
      return { error: null, needsConfirmation: false };
    },
    [persist]
  );

  const signInWithMagicLink = useCallback(async (email: string) => {
    if (!email.trim()) return { error: 'Please enter your email address.' };
    persist(email.trim());
    return { error: null };
  }, [persist]);

  const signInWithDemo = useCallback(() => {
    persist('demo.trade.customer@example.com');
  }, [persist]);

  const signOut = useCallback(async () => {
    setUser(null);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // best effort
    }
  }, []);

  const value = useMemo<FreeToolsAuthState>(
    () => ({
      user,
      loading: false,
      accessToken: null,
      tierInfo: null,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signInWithMagicLink,
      signInWithDemo,
      signOut,
      isAuthModalOpen,
      openAuthModal: () => setAuthModalOpen(true),
      closeAuthModal: () => setAuthModalOpen(false),
    }),
    [user, isAuthModalOpen, signInWithGoogle, signInWithEmail, signUpWithEmail, signInWithMagicLink, signInWithDemo, signOut]
  );

  return <FreeToolsAuthContext.Provider value={value}>{children}</FreeToolsAuthContext.Provider>;
}

export function useFreeToolsAuth() {
  // Provider is mounted app-wide; the cast keeps the consumer API non-nullable.
  return useContext(FreeToolsAuthContext) as FreeToolsAuthState;
}
