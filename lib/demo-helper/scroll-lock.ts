/** Shared, reference-counted scroll lock for overlapping demo surfaces. No persisted state. */
let locks = 0;
let previousOverflow = '';
export function lockBodyScroll(): () => void {
  if (typeof document === 'undefined') return () => {};
  if (locks++ === 0) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks === 0) document.body.style.overflow = previousOverflow;
  };
}
