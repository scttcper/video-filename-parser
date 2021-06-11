const completeExp = /\b(COMPLETE)\b/i;
export function isComplete(title: string): boolean | undefined {
  return completeExp.test(title) || undefined;
}
