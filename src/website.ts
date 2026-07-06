// Adapted from Radarr's ParserCommon website cleanup expressions.
// Keep these shared so title and group parsing strip the same tracker noise.
const domainExp = String.raw`(?:www\.)?[-a-z0-9-]{1,256}\.(?<!Naruto-Kun\.)(?:[a-z]{2,6}\.[a-z]{2,6}|xn--[a-z0-9-]{4,59}|[a-z]{2,63})\b`;

export const websitePrefixExp = new RegExp(
  String.raw`^(?:(?:\[|\()[ \t]{0,32})?${domainExp}(?:[ \t]{0,32}(?:\]|\))|[ -]{2,})[ -]{0,64}`,
  'i',
);

export const websitePostfixExp = new RegExp(
  String.raw`(?:\[[ \t]{0,32}${domainExp}[ \t]{0,32}\]|[ -]{2,}${domainExp})$`,
  'i',
);

export const cleanTorrentSuffixExp = /\[(?:ettv|rartv|rarbg|cttv|publichd)\]$/i;

export function hasWebsitePrefix(title: string): boolean {
  return mightHaveWebsitePrefix(title) && websitePrefixExp.test(title);
}

export function removeWebsitePrefix(title: string): string {
  return mightHaveWebsitePrefix(title) ? title.replace(websitePrefixExp, '') : title;
}

function mightHaveWebsitePrefix(title: string): boolean {
  const first = title.charCodeAt(0);

  return (
    first === 40 ||
    first === 91 ||
    lowerAsciiCode(first) === 119 ||
    title.includes(' - ') ||
    title.includes('--') ||
    title.includes('  ')
  );
}

function lowerAsciiCode(code: number): number {
  return code >= 65 && code <= 90 ? code + 32 : code;
}
