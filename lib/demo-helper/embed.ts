/** UI scope only. This is not an authentication or security boundary. */
export const ASSISTANT_FRAME_NAME = 'apex-assistant-website';

export function shouldHideCompanions(embedded: boolean, frameName: string): boolean {
  return embedded && frameName === ASSISTANT_FRAME_NAME;
}

/** Named iframe survives same-origin page navigation without leaking query flags. */
export function isAssistantWebsiteFrame(): boolean {
  if (typeof window === 'undefined') return false;
  try { return shouldHideCompanions(window.self !== window.top, window.name); }
  catch { return false; }
}
export const subscribeFrame = () => () => {};
