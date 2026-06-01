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

const maxParseLength = 2048;

export function limitParseInput(value: string): string {
  return value.length > maxParseLength ? value.slice(0, maxParseLength) : value;
}
