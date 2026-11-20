import { parseTitleAndYear } from './title/index.js';
export enum Language {
  English = 'English',
  French = 'French',
  Spanish = 'Spanish',
  German = 'German',
  Italian = 'Italian',
  Danish = 'Danish',
  Dutch = 'Dutch',
  Japanese = 'Japanese',
  Cantonese = 'Cantonese',
  Mandarin = 'Mandarin',
  Russian = 'Russian',
  Polish = 'Polish',
  Vietnamese = 'Vietnamese',
  Nordic = 'Nordic',
  Swedish = 'Swedish',
  Norwegian = 'Norwegian',
  Finnish = 'Finnish',
  Turkish = 'Turkish',
  Portuguese = 'Portuguese',
  Flemish = 'Flemish',
  Greek = 'Greek',
  Korean = 'Korean',
  Hungarian = 'Hungarian',
  Persian = 'Persian',
  Bengali = 'Bengali',
  Bulgarian = 'Bulgarian',
  Brazilian = 'Brazilian',
  Hebrew = 'Hebrew',
  Czech = 'Czech',
  Ukrainian = 'Ukrainian',
  Catalan = 'Catalan',
  Chinese = 'Chinese',
  Thai = 'Thai',
  Hindi = 'Hindi',
  Tamil = 'Tamil',
  Telugu = 'Telugu',
  Malayalam = 'Malayalam',
  Kannada = 'Kannada',
  Arabic = 'Arabic',
  Estonian = 'Estonian',
  Icelandic = 'Icelandic',
  Latvian = 'Latvian',
  Lithuanian = 'Lithuanian',
  Romanian = 'Romanian',
  Slovak = 'Slovak',
  Serbian = 'Serbian',
  Slovenian = 'Slovenian',
  Croatian = 'Croatian',
  Indonesian = 'Indonesian',
  Filipino = 'Filipino',
}

const languageAliasRules: Array<{ language: Language; aliases: string[] }> = [
  { language: Language.English, aliases: ['english', 'eng', 'en', 'ing'] },
  { language: Language.Spanish, aliases: ['spanish', 'spa', 'esp', 'castellano'] },
  { language: Language.Danish, aliases: ['dk', 'dan', 'danish'] },
  { language: Language.Japanese, aliases: ['japanese', 'jap', 'jpn'] },
  { language: Language.Cantonese, aliases: ['cantonese'] },
  { language: Language.Mandarin, aliases: ['mandarin'] },
  { language: Language.Korean, aliases: ['korean', 'kor'] },
  { language: Language.Vietnamese, aliases: ['vietnamese', 'vie'] },
  { language: Language.Swedish, aliases: ['se', 'swe', 'swedish'] },
  { language: Language.Finnish, aliases: ['fi', 'finnish'] },
  { language: Language.Turkish, aliases: ['turkish', 'tur'] },
  { language: Language.Portuguese, aliases: ['portuguese'] },
  { language: Language.Hebrew, aliases: ['hebrew', 'hebdub', 'hebdubbed'] },
  { language: Language.Czech, aliases: ['cz', 'czech'] },
  { language: Language.Ukrainian, aliases: ['ukr', 'ukrainian'] },
  { language: Language.Catalan, aliases: ['catalan', 'catala', 'català', 'catalán'] },
  { language: Language.Estonian, aliases: ['estonian'] },
  { language: Language.Icelandic, aliases: ['ice', 'icelandic'] },
  { language: Language.Chinese, aliases: ['chi', 'chinese'] },
  { language: Language.Thai, aliases: ['thai'] },
  { language: Language.Italian, aliases: ['ita', 'italian'] },
  {
    language: Language.German,
    aliases: ['german', 'swissgerman', 'ger', 'deu', 'deutsch', 'videomann'],
  },
  { language: Language.Flemish, aliases: ['flemish'] },
  { language: Language.Greek, aliases: ['greek'] },
  {
    language: Language.French,
    aliases: [
      'fr',
      'fre',
      'fra',
      'french',
      'vf',
      'vfi',
      'vostfr',
      'vo',
      'vff',
      'vfq',
      'vf2',
      'truefrench',
      'subfrench',
    ],
  },
  { language: Language.Russian, aliases: ['rus', 'ru', 'russian'] },
  { language: Language.Norwegian, aliases: ['norwegian'] },
  { language: Language.Hungarian, aliases: ['hun', 'hundub', 'hungarian'] },
  { language: Language.Polish, aliases: ['pl', 'pldub', 'dubpl', 'pllek', 'lekpl', 'polish'] },
  { language: Language.Dutch, aliases: ['nl', 'dutch'] },
  { language: Language.Hindi, aliases: ['hin', 'hindi'] },
  { language: Language.Tamil, aliases: ['tam', 'tamil'] },
  { language: Language.Telugu, aliases: ['tel', 'telugu'] },
  { language: Language.Malayalam, aliases: ['malayalam'] },
  { language: Language.Kannada, aliases: ['kannada'] },
  { language: Language.Arabic, aliases: ['arabic'] },
  { language: Language.Latvian, aliases: ['latvian', 'lv', 'lat', 'lav'] },
  { language: Language.Lithuanian, aliases: ['lithuanian'] },
  { language: Language.Romanian, aliases: ['ro', 'romanian', 'rodubbed'] },
  { language: Language.Slovak, aliases: ['sk', 'slovak'] },
  { language: Language.Brazilian, aliases: ['brazilian', 'dublado'] },
  { language: Language.Persian, aliases: ['persian'] },
  { language: Language.Bengali, aliases: ['bengali'] },
  { language: Language.Bulgarian, aliases: ['bulgarian', 'bgaudio'] },
  { language: Language.Serbian, aliases: ['serbian'] },
  { language: Language.Slovenian, aliases: ['slovenian', 'slovene'] },
  { language: Language.Croatian, aliases: ['croatian'] },
  { language: Language.Indonesian, aliases: ['indonesian'] },
  { language: Language.Filipino, aliases: ['filipino', 'tagalog'] },
  { language: Language.Nordic, aliases: ['nordic', 'nordicsubs'] },
];

// Codes that are only a language when written in upper case, or markers that aren't single tokens.
// The SUB and DTS exclusions match any case (Sub.DE, dts.ES) since only the code itself is cased.
// Matched against the release title with the series/movie title cut out.
const languageExpRules: Array<{ language: Language; exp: RegExp }> = [
  { language: Language.Norwegian, exp: /\bNO\b/ },
  { language: Language.Bulgarian, exp: /(?<![Ss][Uu][Bb][\W_])\bBG\b(?![\W_][Ss][Uu][Bb])/ },
  { language: Language.German, exp: /(?<![Ss][Uu][Bb][\W_])\bDE\b(?![\W_][Ss][Uu][Bb])/ },
  {
    language: Language.Spanish,
    exp: /(?<![Ss][Uu][Bb][\W_])(?<![Dd][Tt][Ss][._ -])\bES\b(?![\W_][Ss][Uu][Bb])/,
  },
  { language: Language.Catalan, exp: /[-,. ]cat[. ](?:DD|subs)/i },
  { language: Language.Portuguese, exp: /[_. ]por[_. ]/i },
  { language: Language.Ukrainian, exp: /\b\d+x?ukr\b/i },
];

// Markers that can't be part of a title, matched against the whole release title
const languageMarkerRules: Array<{ language: Language; exp: RegExp }> = [
  { language: Language.Chinese, exp: /\[(?:CH[ST]|BIG5|GB)\]|简|繁|字幕|国语音轨/ },
  { language: Language.Japanese, exp: /\(JA\)/ },
  { language: Language.Brazilian, exp: /\bpt-BR\b/i },
];

const tokenExp = /[\p{L}\p{N}]+/gu;
const multiTokens = new Set(['multi', 'dual', 'dl']);
const languageAliasTokens = new Set(languageAliasRules.flatMap(({ aliases }) => aliases));

/** Lower case language names and codes the parser recognizes, like `kor` or `hun` */
export function getLanguageAliasTokens(): ReadonlySet<string> {
  return languageAliasTokens;
}
const languageOrMultiExp = new RegExp(
  String.raw`(?<![\p{L}\p{N}])(?:${[...languageAliasTokens, ...multiTokens].join('|')})(?![\p{L}\p{N}])`,
  'iu',
);
// Season/episode tokens end a series title, anything after them is the episode title or release info
const seasonEpisodeTokenExp = /^(?:s\d{1,4}(?:e\d{1,4})*|\d{1,2}x\d{1,3}|e\d{1,4})$/;
const germanMultiLanguageExp = /\bML\b/i;

interface Token {
  text: string;
  start: number;
  end: number;
}

export function parseLanguage(title: string, parsedTitle?: string): Language[] {
  return parseLanguageInfo(title, parsedTitle).languages;
}

export function parseLanguageInfo(
  title: string,
  parsedTitle?: string,
): { languages: Language[]; multi?: boolean | undefined } {
  if (!languageOrMultiExp.test(title) && !hasLanguageExp(title)) {
    return { languages: [Language.English] };
  }

  const allTitleTokens = tokenize(title);
  const multi = hasMultiLanguageToken(allTitleTokens) || undefined;

  if (
    !multi &&
    !allTitleTokens.some(({ text }) => languageAliasTokens.has(text)) &&
    !hasLanguageExp(title)
  ) {
    return { languages: [Language.English] };
  }

  parsedTitle ??= parseTitleAndYear(title).title;
  const titleSpan = findParsedTitleSpan(allTitleTokens, tokenize(parsedTitle));
  const titleTokens = titleSpan
    ? [...allTitleTokens.slice(0, titleSpan.from), ...allTitleTokens.slice(titleSpan.to)]
    : allTitleTokens;
  const releaseInfo = titleSpan
    ? title.slice(0, titleSpan.start) + title.slice(titleSpan.end)
    : title;

  const titleTokenSet = new Set(titleTokens.map(({ text }) => text));
  const languages = [
    ...languageAliasRules
      .filter(({ aliases }) => aliases.some(alias => titleTokenSet.has(alias)))
      .map(({ language }) => language),
    ...languageExpRules.filter(({ exp }) => exp.test(releaseInfo)).map(({ language }) => language),
    ...languageMarkerRules.filter(({ exp }) => exp.test(title)).map(({ language }) => language),
  ];

  if (hasMultiLanguageToken(titleTokens)) {
    languages.push(Language.English);
  }

  // German ML releases also carry the original (usually English) audio
  if (
    languages.length === 1 &&
    languages[0] === Language.German &&
    germanMultiLanguageExp.test(releaseInfo)
  ) {
    languages.push(Language.English);
  }

  if (languages.length === 0) {
    languages.push(Language.English);
  }

  return { languages: [...new Set(languages)], multi };
}

function hasLanguageExp(title: string): boolean {
  return (
    languageExpRules.some(({ exp }) => exp.test(title)) ||
    languageMarkerRules.some(({ exp }) => exp.test(title))
  );
}

function tokenize(title: string): Token[] {
  return Array.from(title.matchAll(tokenExp), match => ({
    text: match[0].toLowerCase(),
    start: match.index,
    end: match.index + match[0].length,
  }));
}

/**
 * Finds the parsed title inside the release title tokens. A series title stops at the first
 * season/episode token so language words in the episode title still count.
 */
function findParsedTitleSpan(
  titleTokens: Token[],
  parsedTitleTokens: Token[],
): { from: number; to: number; start: number; end: number } | undefined {
  const seasonIndex = parsedTitleTokens.findIndex(({ text }) => seasonEpisodeTokenExp.test(text));
  const sequence = (
    seasonIndex === -1 ? parsedTitleTokens : parsedTitleTokens.slice(0, seasonIndex)
  ).map(({ text }) => text);
  if (sequence.length === 0 || sequence.length > titleTokens.length) {
    return undefined;
  }

  const from = titleTokens.findIndex((_, index) =>
    sequence.every((text, offset) => titleTokens[index + offset]?.text === text),
  );
  if (from === -1) {
    return undefined;
  }

  const to = from + sequence.length;
  return { from, to, start: titleTokens[from]!.start, end: titleTokens[to - 1]!.end };
}

function hasMultiLanguageToken(tokens: Token[]): boolean {
  return tokens.some(
    ({ text }, index) =>
      multiTokens.has(text) && !(text === 'dl' && tokens[index - 1]?.text === 'web'),
  );
}

export function isMulti(title: string): boolean | undefined {
  return hasMultiLanguageToken(tokenize(title)) || undefined;
}
