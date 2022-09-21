export function removeEmpty<T = Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj as Record<any, any>).filter(([_, v]) => v !== null),
  ) as any;
}
