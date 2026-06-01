// Adapted from Radarr's ParserCommon website cleanup expressions.
// Keep these shared so title and group parsing strip the same tracker noise.
export const websitePrefixExp =
  /^(?:(?:\[|\()[ \t]{0,32})?(?:www\.)?[-a-z0-9-]{1,256}\.(?<!Naruto-Kun\.)(?:[a-z]{2,6}\.[a-z]{2,6}|xn--[a-z0-9-]{4,59}|[a-z]{2,63})\b(?:[ \t]{0,32}(?:\]|\))|[ -]{2,})[ -]{0,64}/i;

export const websitePostfixExp =
  /(?:\[[ \t]{0,32})?(?:www\.)?[-a-z0-9-]{1,256}\.(?:xn--[a-z0-9-]{4,59}|[a-z]{2,63})\b(?:[ \t]{0,32}\])$/i;

export const cleanTorrentSuffixExp = /\[(?:ettv|rartv|rarbg|cttv|publichd)\]$/i;
