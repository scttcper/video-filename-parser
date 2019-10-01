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
}

export const languageExp = /(?:\W|_|^)(?<italian>\b(?:ita|italian)\b)|(?<german>german\b|videomann)|(?<flemish>flemish)|(?<greek>greek)|(?<french>(?:\W|_)(?:FR|VOSTFR|VO|VFF|VFQ|VF2|TRUEFRENCH)(?:\W|_))|(?<russian>\brus\b)|(?<dutch>nl\W?subs?)|(?<hungarian>\b(?:HUNDUB|HUN)\b)|(?<hebrew>\bHebDub\b)|(?<czech>\b(?:CZ|SK)\b)|(?<ukrainian>\bukr\b)/i;

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

  const result = languageExp.exec(languageTitle);
  if (result !== null && result.groups !== undefined) {
    if (result.groups.italian !== undefined) {
      languages.push(Language.Italian);
    }

    if (result.groups.german !== undefined) {
      languages.push(Language.German);
    }

    if (result.groups.flemish !== undefined) {
      languages.push(Language.Flemish);
    }

    if (result.groups.greek !== undefined) {
      languages.push(Language.Greek);
    }

    if (result.groups.french !== undefined) {
      languages.push(Language.French);
    }

    if (result.groups.russian !== undefined) {
      languages.push(Language.Russian);
    }

    if (result.groups.dutch !== undefined) {
      languages.push(Language.Dutch);
    }

    if (result.groups.hungarian !== undefined) {
      languages.push(Language.Hungarian);
    }

    if (result.groups.hebrew !== undefined) {
      languages.push(Language.Hebrew);
    }

    if (result.groups.czech !== undefined) {
      languages.push(Language.Czech);
    }

    if (result.groups.ukrainian !== undefined) {
      languages.push(Language.Ukrainian);
    }
  }

  if (languageTitle.includes('multi')) {
    languages.push(Language.English);
  }

  if (languages.length === 0) {
    languages.push(Language.English);
  }

  return [...new Set(languages)];
}
