export function removeEmpty<T extends object>(obj: T): T {
  const result: Partial<T> = {};

  for (const key in obj) {
    const value = obj[key];
    if (value != null) {
      result[key] = value;
    }
  }

  return result as T;
}
