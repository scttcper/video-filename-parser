const simpleTitleRegex = /\s*(?:480[ip]|576[ip]|720[ip]|1080[ip]|2160[ip]|HVEC|[xh][\W_]?26[45]|DD\W?5\W1|[<>?*:|]|848x480|1280x720|1920x1080|(8|10)b(it)?)/i;
const websitePrefixRegex = /^\[\s*[a-z]+(\.[a-z]+)+\s*\][- ]*|^www\.[a-z]+\.(?:com|net)[ -]*/i;
const cleanTorrentSuffixRegex = /\[(?:ettv|rartv|rarbg|cttv)\]$/i;

export function simplifyTitle(title: string): string {
  let simpleTitle = title.replace(simpleTitleRegex, '');
  simpleTitle = simpleTitle.replace(websitePrefixRegex, '');
  simpleTitle = simpleTitle.replace(cleanTorrentSuffixRegex, '');
  return simpleTitle;
}
