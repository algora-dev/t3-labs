import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const fixtures = new URL('./inquiry-preview-fixtures.mjs', import.meta.url).href;
export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server' || specifier === '@/lib/assistant/session') {
    return { url: fixtures, shortCircuit: true };
  }
  if (specifier.startsWith('@/')) return nextResolve(pathToFileURL(path.join(root, specifier.slice(2) + '.ts')).href, context);
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\.[a-z0-9]+$/i.test(specifier)) {
    try { return await nextResolve(specifier + '.ts', context); } catch { /* use default */ }
  }
  return nextResolve(specifier, context);
}
