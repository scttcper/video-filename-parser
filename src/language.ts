import { parseTitleAndYear } from './title';

/* eslint-disable complexity */
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
  Swedish = 'Swedish',
  Norwegian = 'Norwegian',
  Finnish = 'Finnish',
  Turkish = 'Turkish',
  Portuguese = 'Portuguese',
  Flemish = 'Flemish',
  Greek = 'Greek',
  Korean = 'Korean',
  Hungarian = 'Hungarian',
  Hebrew = 'Hebrew',
  Czech = 'Czech',
  Ukrainian = 'Ukrainian',
  Catalan = 'Catalan',
  Chinese = 'Chinese',
}

export const languageExp =
  /(?:\W|_|^)(?<italian>\b(?:ita|italian)\b)|(?<german>german\b|videomann)|(?<flemish>flemish)|(?<greek>greek)|(?<french>(?:\W|_)(?:FR|VOSTFR|VO|VFF|VFQ|VF2|TRUEFRENCH)(?:\W|_))|(?<russian>\brus\b)|(?<dutch>nl\W?subs?)|(?<hungarian>\b(?:HUNDUB|HUN)\b)|(?<hebrew>\bHebDub\b)|(?<czech>\b(?:CZ|SK)\b)|(?<ukrainian>\bukr\b)|(?<polish>\bPL\b)/i;

export function parseLanguage(title: string): Language[] {
  const parsedTitle = parseTitleAndYear(title, true).title;
  const languageTitle = title.replace(parsedTitle, '').toLowerCase();
  const languages: Language[] = [];

  for (const language of Object.keys(Language)) {
    if (languageTitle.includes(language.toLowerCase())) {
      languages.push(Language[language]);
    }
  }

  if (languageTitle.includes('english')) {
    languages.push(Language.English);
  }

  if (languageTitle.includes('french')) {
    languages.push(Language.French);
  }

  if (languageTitle.includes('spanish')) {
    languages.push(Language.Spanish);
  }

  if (languageTitle.includes('danish')) {
    languages.push(Language.Danish);
  }

  if (languageTitle.includes('dutch')) {
    languages.push(Language.Dutch);
  }

  if (languageTitle.includes('japanese')) {
    languages.push(Language.Japanese);
  }

  if (languageTitle.includes('cantonese')) {
    languages.push(Language.Cantonese);
  }

  if (languageTitle.includes('mandarin')) {
    languages.push(Language.Mandarin);
  }

  if (languageTitle.includes('korean')) {
    languages.push(Language.Korean);
  }

  if (languageTitle.includes('russian')) {
    languages.push(Language.Russian);
  }

  if (languageTitle.includes('polish')) {
    languages.push(Language.Polish);
  }

  if (languageTitle.includes('vietnamese')) {
    languages.push(Language.Vietnamese);
  }

  if (languageTitle.includes('swedish')) {
    languages.push(Language.Swedish);
  }

  if (languageTitle.includes('norwegian')) {
    languages.push(Language.Norwegian);
  }

  if (languageTitle.includes('nordic')) {
    languages.push(Language.Norwegian);
  }

  if (languageTitle.includes('finnish')) {
    languages.push(Language.Finnish);
  }

  if (languageTitle.includes('turkish')) {
    languages.push(Language.Turkish);
  }

  if (languageTitle.includes('portuguese')) {
    languages.push(Language.Portuguese);
  }

  if (languageTitle.includes('hungarian')) {
    languages.push(Language.Hungarian);
  }

  if (languageTitle.includes('hebrew')) {
    languages.push(Language.Hebrew);
  }

  if (languageTitle.includes('czech')) {
    languages.push(Language.Czech);
  }

  if (languageTitle.includes('ukrainian')) {
    languages.push(Language.Ukrainian);
  }

  if (languageTitle.includes('catalan')) {
    languages.push(Language.Catalan);
  }

  if (languageTitle.includes('chinese')) {
    languages.push(Language.Chinese);
  }

  const result = languageExp.exec(languageTitle);
  if (result?.groups) {
    if (result.groups.italian) {
      languages.push(Language.Italian);
    }

    if (result.groups.german) {
      languages.push(Language.German);
    }

    if (result.groups.flemish) {
      languages.push(Language.Flemish);
    }

    if (result.groups.greek) {
      languages.push(Language.Greek);
    }

    if (result.groups.french) {
      languages.push(Language.French);
    }

    if (result.groups.russian) {
      languages.push(Language.Russian);
    }

    if (result.groups.dutch) {
      languages.push(Language.Dutch);
    }

    if (result.groups.hungarian) {
      languages.push(Language.Hungarian);
    }

    if (result.groups.hebrew) {
      languages.push(Language.Hebrew);
    }

    if (result.groups.czech) {
      languages.push(Language.Czech);
    }

    if (result.groups.ukrainian) {
      languages.push(Language.Ukrainian);
    }

    if (result.groups.polish) {
      languages.push(Language.Polish);
    }
  }

  if (isMulti(languageTitle)) {
    languages.push(Language.English);
  }

  if (languages.length === 0) {
    languages.push(Language.English);
  }

  return [...new Set(languages)];
}

// Reviens-moi (2007) [1080p] BluRay MULTi x264-PopHD
const multiExp = /\b(MULTi|DUAL)\b/i;
export function isMulti(title: string): boolean | undefined {
  return multiExp.test(title) || undefined;
}
