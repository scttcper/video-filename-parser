export function removeEmpty<T = Record<string, unknown>>(obj: T): T {
  // eslint-disable-next-line no-eq-null, eqeqeq
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null)) as any;
}
