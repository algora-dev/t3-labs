/**
 * Resolve hook so the Node test runner can load the TypeScript pricing lib,
 * which uses extensionless relative imports ('./catalog'). Appends '.ts'
 * when the specifier has no file extension. Registered from pricing.test.mjs.
 */
export async function resolve(specifier, context, nextResolve) {
  if (
    (specifier.startsWith('./') || specifier.startsWith('../') || specifier.startsWith('/')) &&
    !/\.[a-z0-9]+$/i.test(specifier)
  ) {
    try {
      return await nextResolve(specifier + '.ts', context);
    } catch {
      // fall through to default resolution
    }
  }
  return nextResolve(specifier, context);
}
