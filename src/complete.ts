const completeDvdExp = /\b(NTSC|PAL)?.DVDR\b/i;
export function isCompleteDvd(title: string): boolean | undefined {
  return completeDvdExp.test(title) || undefined;
}

const completeExp = /\b(COMPLETE)\b/i;
export function isComplete(title: string): boolean | undefined {
  return completeExp.test(title) || isCompleteDvd(title) || undefined;
}
