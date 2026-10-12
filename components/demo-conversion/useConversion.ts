'use client';
import { useMemo, useSyncExternalStore } from 'react';
import { conversionSnapshot, subscribeConversion } from '../../lib/demo-conversion/store';
import { initialConversion } from '../../lib/demo-conversion/state';
import type { ConversionState } from '../../lib/demo-conversion/state';
export function useConversion(): ConversionState {
  const raw = useSyncExternalStore(subscribeConversion, conversionSnapshot, () => null);
  return useMemo(() => raw ? JSON.parse(raw) as ConversionState : initialConversion(), [raw]);
}
