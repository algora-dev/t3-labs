'use client';
import { useMemo, useSyncExternalStore } from 'react';
import { journeySnapshot, subscribeJourney } from '../../lib/demo-journey/store';
import { readJourney } from '../../lib/demo-journey/state';
const serverSnapshot = () => null;
export function useDemoJourney() {
  const raw = useSyncExternalStore(subscribeJourney, journeySnapshot, serverSnapshot);
  return useMemo(() => readJourney(raw), [raw]);
}
