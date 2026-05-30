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

const languagePatterns: Array<{ language: Language; pattern: RegExp | string }> = [
  { language: Language.English, pattern: /\b(english|eng|EN|FI)\b/i },
  { language: Language.Spanish, pattern: 'spanish' },
  { language: Language.Danish, pattern: /\b(DK|DAN|danish)\b/i },
  { language: Language.Japanese, pattern: 'japanese' },
  { language: Language.Cantonese, pattern: 'cantonese' },
  { language: Language.Mandarin, pattern: 'mandarin' },
  { language: Language.Korean, pattern: 'korean' },
  { language: Language.Vietnamese, pattern: 'vietnamese' },
  { language: Language.Swedish, pattern: /\b(SE|SWE|swedish)\b/i },
  { language: Language.Finnish, pattern: 'finnish' },
  { language: Language.Turkish, pattern: 'turkish' },
  { language: Language.Portuguese, pattern: 'portuguese' },
  { language: Language.Hebrew, pattern: 'hebrew' },
  { language: Language.Czech, pattern: 'czech' },
  { language: Language.Ukrainian, pattern: 'ukrainian' },
  { language: Language.Catalan, pattern: 'catalan' },
  { language: Language.Estonian, pattern: 'estonian' },
  { language: Language.Icelandic, pattern: /\b(ice|Icelandic)\b/i },
  { language: Language.Chinese, pattern: /\b(chi|chinese)\b/i },
  { language: Language.Thai, pattern: 'thai' },
  { language: Language.Italian, pattern: /\b(ita|italian)\b/i },
  { language: Language.German, pattern: /\b(german|videomann)\b/i },
  { language: Language.Flemish, pattern: /\b(flemish)\b/i },
  { language: Language.Greek, pattern: /\b(greek)\b/i },
  {
    language: Language.French,
    pattern: /\b(FR|FRENCH|VOSTFR|VO|VFF|VFQ|VF2|TRUEFRENCH|SUBFRENCH)\b/i,
  },
  { language: Language.Russian, pattern: /\b(russian|rus)\b/i },
  { language: Language.Norwegian, pattern: /\b(norwegian|NO)\b/i },
  { language: Language.Hungarian, pattern: /\b(HUNDUB|HUN|hungarian)\b/i },
  { language: Language.Hebrew, pattern: /\b(HebDub)\b/i },
  { language: Language.Czech, pattern: /\b(CZ|SK)\b/i },
  { language: Language.Ukrainian, pattern: /\bukr\b/i },
  { language: Language.Polish, pattern: /\b(PL|PLDUB|POLISH)\b/i },
  { language: Language.Dutch, pattern: /\b(nl|dutch)\b/i },
  { language: Language.Hindi, pattern: /\b(HIN|Hindi)\b/i },
  { language: Language.Tamil, pattern: /\b(TAM|Tamil)\b/i },
  { language: Language.Arabic, pattern: /\b(Arabic)\b/i },
  { language: Language.Latvian, pattern: /\b(Latvian)\b/i },
  { language: Language.Lithuanian, pattern: /\b(Lithuanian)\b/i },
  { language: Language.Romanian, pattern: /\b(RO|Romanian|rodubbed)\b/i },
  { language: Language.Slovak, pattern: /\b(SK|Slovak)\b/i },
  { language: Language.Brazilian, pattern: /\b(Brazilian)\b/i },
  { language: Language.Persian, pattern: /\b(Persian)\b/i },
  { language: Language.Bengali, pattern: /\b(Bengali)\b/i },
  { language: Language.Bulgarian, pattern: /\b(Bulgarian)\b/i },
  { language: Language.Serbian, pattern: /\b(Serbian)\b/i },
  { language: Language.Nordic, pattern: /\b(nordic|NORDICSUBS)\b/i },
];

export function parseLanguage(title: string, parsedTitle?: string): Language[] {
  parsedTitle ??= parseTitleAndYear(title).title;
  const languageTitle = title.replaceAll('.', ' ').replace(parsedTitle, '').toLowerCase();
  const languages = languagePatterns
    .filter(({ pattern }) => matchesLanguagePattern(languageTitle, pattern))
    .map(({ language }) => language);

  if (isMulti(languageTitle)) {
    languages.push(Language.English);
  }

  if (languages.length === 0) {
    languages.push(Language.English);
  }

  return [...new Set(languages)];
}

function matchesLanguagePattern(languageTitle: string, pattern: RegExp | string): boolean {
  if (typeof pattern === 'string') {
    return languageTitle.includes(pattern);
  }

  return pattern.test(languageTitle);
}

// Reviens-moi (2007) [1080p] BluRay MULTi x264-PopHD
const multiExp = /(?<!(WEB-))\b(MULTi|DUAL|DL)\b/i;
export function isMulti(title: string): boolean | undefined {
  const noWebTitle = title.replace(/\bWEB-?DL\b/i, '');
  return multiExp.test(noWebTitle) || undefined;
}
