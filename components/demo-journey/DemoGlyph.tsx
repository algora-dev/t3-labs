import type { TaskId } from '../../lib/demo-journey/config';
export function DemoGlyph({ kind }: { kind: TaskId }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'assistant' && <><path d="M27 15a11 11 0 0 1-11 11H7l-5 4 2-9a11 11 0 1 1 23-6Z" /><path d="M10 13h12M10 18h8" /></>}
    {kind === 'quick' && <><path d="m3 15 13-11 13 11M7 13v15h18V13M12 28v-9h8v9" /><path d="m21 4 1-3" /></>}
    {kind === 'detailed' && <><rect x="6" y="3" width="20" height="26" rx="3" /><path d="M11 8h10M11 14h2m6 0h2M11 19h2m6 0h2M11 24h2m6 0h2" /></>}
    {kind === 'plan' && <><path d="M5 5h22v22H5zM5 16h22M16 5l-6 11 6 11M27 5 16 16l11 11" /><circle cx="5" cy="5" r="2" /><circle cx="27" cy="27" r="2" /></>}
    {kind === 'trade' && <><path d="m5 20 8-8 5 5 9-12M20 5h7v7M5 27h22" /><path d="M5 4v7h7" /></>}
  </svg>;
}
