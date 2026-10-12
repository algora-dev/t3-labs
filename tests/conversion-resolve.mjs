// Standalone resolver for conversion tests in the lean handoff (no npm packages).
export async function resolve(specifier, context, nextResolve) {
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\.[a-z0-9]+$/i.test(specifier)) {
    try { return await nextResolve(specifier + '.ts', context); } catch { /* Fall through. */ }
  }
  return nextResolve(specifier, context);
}
