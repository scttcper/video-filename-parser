const completeDvdExp = /\b(NTSC|PAL)?.DVDR\b/i;
export function isCompleteDvd(title: string): boolean | undefined {
  return completeDvdExp.test(title) || undefined;
}

const completeExp = /\b(COMPLETE)\b/i;
export function isComplete(title: string): boolean | undefined {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  return completeExp.test(title) || isCompleteDvd(title) || undefined;
}
