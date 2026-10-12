import { HELPER_MOBILE_NOTICE_KEY } from './store';
/** One small-screen choice before the guided tour starts, asked once per tab.
 *  Matches the demo helper's existing mobile breakpoint (viewport under 760px). */
export function holdMobileStart(): boolean {
  if (typeof window === 'undefined' || window.innerWidth >= 760) return false;
  try { if (sessionStorage.getItem(HELPER_MOBILE_NOTICE_KEY) === '1') return false; } catch { return false; }
  try { sessionStorage.setItem(HELPER_MOBILE_NOTICE_KEY, '1'); } catch { /* Optional storage. */ }
  return true;
}
