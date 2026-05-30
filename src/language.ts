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
  Arabic = 'Arabic',
  Estonian = 'Estonian',
  Icelandic = 'Icelandic',
  Latvian = 'Latvian',
  Lithuanian = 'Lithuanian',
  Romanian = 'Romanian',
  Slovak = 'Slovak',
  Serbian = 'Serbian',
}

const languageAliasRules: Array<{ language: Language; aliases: string[] }> = [
  { language: Language.English, aliases: ['english', 'eng', 'en'] },
  { language: Language.Spanish, aliases: ['spanish'] },
  { language: Language.Danish, aliases: ['dk', 'dan', 'danish'] },
  { language: Language.Japanese, aliases: ['japanese'] },
  { language: Language.Cantonese, aliases: ['cantonese'] },
  { language: Language.Mandarin, aliases: ['mandarin'] },
  { language: Language.Korean, aliases: ['korean'] },
  { language: Language.Vietnamese, aliases: ['vietnamese'] },
  { language: Language.Swedish, aliases: ['se', 'swe', 'swedish'] },
  { language: Language.Finnish, aliases: ['fi', 'finnish'] },
  { language: Language.Turkish, aliases: ['turkish'] },
  { language: Language.Portuguese, aliases: ['portuguese'] },
  { language: Language.Hebrew, aliases: ['hebrew', 'hebdub'] },
  { language: Language.Czech, aliases: ['cz', 'czech'] },
  { language: Language.Ukrainian, aliases: ['ukr', 'ukrainian'] },
  { language: Language.Catalan, aliases: ['catalan'] },
  { language: Language.Estonian, aliases: ['estonian'] },
  { language: Language.Icelandic, aliases: ['ice', 'icelandic'] },
  { language: Language.Chinese, aliases: ['chi', 'chinese'] },
  { language: Language.Thai, aliases: ['thai'] },
  { language: Language.Italian, aliases: ['ita', 'italian'] },
  { language: Language.German, aliases: ['german', 'videomann'] },
  { language: Language.Flemish, aliases: ['flemish'] },
  { language: Language.Greek, aliases: ['greek'] },
  {
    language: Language.French,
    aliases: ['fr', 'french', 'vostfr', 'vo', 'vff', 'vfq', 'vf2', 'truefrench', 'subfrench'],
  },
  { language: Language.Russian, aliases: ['rus', 'russian'] },
  { language: Language.Norwegian, aliases: ['no', 'norwegian'] },
  { language: Language.Hungarian, aliases: ['hun', 'hundub', 'hungarian'] },
  { language: Language.Polish, aliases: ['pl', 'pldub', 'polish'] },
  { language: Language.Dutch, aliases: ['nl', 'dutch'] },
  { language: Language.Hindi, aliases: ['hin', 'hindi'] },
  { language: Language.Tamil, aliases: ['tam', 'tamil'] },
  { language: Language.Arabic, aliases: ['arabic'] },
  { language: Language.Latvian, aliases: ['latvian'] },
  { language: Language.Lithuanian, aliases: ['lithuanian'] },
  { language: Language.Romanian, aliases: ['ro', 'romanian', 'rodubbed'] },
  { language: Language.Slovak, aliases: ['sk', 'slovak'] },
  { language: Language.Brazilian, aliases: ['brazilian'] },
  { language: Language.Persian, aliases: ['persian'] },
  { language: Language.Bengali, aliases: ['bengali'] },
  { language: Language.Bulgarian, aliases: ['bulgarian'] },
  { language: Language.Serbian, aliases: ['serbian'] },
  { language: Language.Nordic, aliases: ['nordic', 'nordicsubs'] },
];

const tokenExp = /[a-z0-9]+/gi;
const multiTokens = new Set(['multi', 'dual', 'dl']);

export function parseLanguage(title: string, parsedTitle?: string): Language[] {
  parsedTitle ??= parseTitleAndYear(title).title;
  const titleTokens = removeParsedTitleTokens(tokenize(title), tokenize(parsedTitle));
  const titleTokenSet = new Set(titleTokens);
  const languages = languageAliasRules
    .filter(({ aliases }) => aliases.some(alias => titleTokenSet.has(alias)))
    .map(({ language }) => language);

  if (hasMultiLanguageToken(titleTokens)) {
    languages.push(Language.English);
  }

  if (languages.length === 0) {
    languages.push(Language.English);
  }

  return [...new Set(languages)];
}

function tokenize(title: string): string[] {
  return Array.from(title.matchAll(tokenExp), match => match[0].toLowerCase());
}

function removeParsedTitleTokens(titleTokens: string[], parsedTitleTokens: string[]): string[] {
  if (parsedTitleTokens.length === 0 || parsedTitleTokens.length > titleTokens.length) {
    return titleTokens;
  }

  const startIndex = findTokenSequence(titleTokens, parsedTitleTokens);
  if (startIndex === -1) {
    return titleTokens;
  }

  return [
    ...titleTokens.slice(0, startIndex),
    ...titleTokens.slice(startIndex + parsedTitleTokens.length),
  ];
}

function findTokenSequence(tokens: string[], sequence: string[]): number {
  return tokens.findIndex((_, index) =>
    sequence.every(
      (sequenceToken, sequenceIndex) => tokens[index + sequenceIndex] === sequenceToken,
    ),
  );
}

function hasMultiLanguageToken(tokens: string[]): boolean {
  return tokens.some(
    (token, index) => multiTokens.has(token) && !(token === 'dl' && tokens[index - 1] === 'web'),
  );
}

export function isMulti(title: string): boolean | undefined {
  return hasMultiLanguageToken(tokenize(title)) || undefined;
}
