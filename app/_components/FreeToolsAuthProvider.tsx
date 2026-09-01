'use client';

/**
 * T3 LABS DEMO PORT — no-op FreeToolsAuthProvider.
 *
 * The supplier pricing tool was ported from quote-core.com, where free-tools
 * login is backed by Supabase. On t3labs.tech the demos are self-contained:
 * `login` is a per-supplier config flag. This provider satisfies the same
 * context API surface but always reports an anonymous visitor, so components
 * render their logged-out branches (which the tool handles gracefully).
 *
 * If a future demo needs real auth, replace this file with a Supabase-backed
 * implementation matching FreeToolsAuthState.
 */

import { createContext, useContext, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';

export interface FreeToolsTierInfo {
  tier: 1 | 2 | 3;
  hasAppAccount: boolean;
  limits: { aiPerDay: number; docPerDay: number | null; imagePerDay: number; textPerDay: number; label: string };
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
  signOut: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'signup' | 'signin') => void;
  closeAuthModal: () => void;
}

const noopState: FreeToolsAuthState = {
  user: null,
  loading: false,
  accessToken: null,
  tierInfo: null,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null, needsConfirmation: false }),
  signInWithMagicLink: async () => ({ error: null }),
  signOut: async () => {},
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
};

const FreeToolsAuthContext = createContext<FreeToolsAuthState>(noopState);

export function FreeToolsAuthProvider({ children }: { children: ReactNode }) {
  return <FreeToolsAuthContext.Provider value={noopState}>{children}</FreeToolsAuthContext.Provider>;
}

export function useFreeToolsAuth() {
  return useContext(FreeToolsAuthContext);
}
