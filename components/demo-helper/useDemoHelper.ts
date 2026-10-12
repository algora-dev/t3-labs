'use client';
import { useMemo, useSyncExternalStore } from 'react';
import { helperSnapshot, subscribeHelper, subscribeSurface, surfaceSnapshot, subscribeAssistantActivity, assistantActivitySnapshot } from '../../lib/demo-helper/store';
import { readHelper } from '../../lib/demo-helper/state';
export function useDemoHelper() {
  const raw = useSyncExternalStore(subscribeHelper, helperSnapshot, () => null);
  return useMemo(() => readHelper(raw), [raw]);
}
export function useHelperSurface() { return useSyncExternalStore(subscribeSurface, surfaceSnapshot, () => 'website' as const); }
export function useAssistantActivity() {
  return useSyncExternalStore(subscribeAssistantActivity, assistantActivitySnapshot, () => null);
}
