import { parseAudioChannels } from '../audioChannels.js';
import { parseAudioCodec } from '../audioCodec.js';
import { getLanguageAliasTokens, Language } from '../language.js';
import { findFirstResolutionToken } from '../resolution.js';
import { parseVideoCodec } from '../videoCodec.js';

interface TitleBoundaryParser {
  name: string;
  parse: (title: string) => string | undefined;
}

const titleBoundaryParsers: TitleBoundaryParser[] = [
  { name: 'resolution', parse: findFirstResolutionToken },
  { name: 'audio-codec', parse: title => parseAudioCodec(title).source },
  { name: 'audio-channels', parse: title => parseAudioChannels(title).source },
  { name: 'video-codec', parse: title => parseVideoCodec(title).source },
];

// Scene tags that end a title with no year. Case-sensitive so title words like "The Complete
// Guide" don't end the title, scene names spell these upper case or iNTERNAL style.
const sceneReleaseTagExp =
  /[-_. ](?:MULTi|MULTI|DUAL|HDR|HDR10|HDR10Plus|DV|HLG|COMPLETE|PROPER|REPACK|iNTERNAL|INTERNAL|DiRFiX|DIRFIX|NFOFiX|NFOFIX|SUBBED|ANiME|ANIME|D\d{2,3})(?=[-_. ]|$)/;
// The tags below need a dot, underscore or space before them. Joined by a hyphen they are part of
// the name (Boys.Dont.Cry-WS-DVDRiP-SPHiSO) and the group parser needs them.
const releaseTagExp =
  /[._ ](?:DUBBED|WS|FS|LIMITED|UNCUT|UNRATED|STV|DL|LD|XXX|DOC|DOCU|DOKU|READNFO|[A-Za-z]{2,7}SUB(?:S|BED)?)(?=[-_. ]|$)/;
// Sources aren't title words, so any case. Gota.Kanal.3.Bakom.Kulisserna.SWEDiSH.PDTV.XViD
const sourceTagExp =
  /[._ ](?:PDTV|SDTV|HDTVRip|DSR|DSRip|TVRip|SATRip|DVBRip|DVB|DTVRip|DTV|DVTV|VHSRip|DVDRip|DVDR|DVD[59]|DVDSCR|SCREENER|SVCD|VCD|BDRip|BRRip|HDRip)(?=[-_. ]|$)/i;
// Short source tags that are also words (My.Pal.Joey, a web cam), only upper case
const upperCaseSourceTagExp = /[._ ](?:PAL|NTSC|SECAM|TS|TC|CAM|R5)(?=[-_. ]|$)/;

// Built on first use, language.ts imports the title parser so Language isn't set at load time
let trailingLanguageExp: RegExp | undefined;
const capitalizedWordExp = /^\p{Lu}\p{Ll}+$/u;
let languageNames: ReadonlySet<string> | undefined;

function isReleaseLanguageSpelling(word: string): boolean {
  languageNames ??= new Set(Object.values(Language).map(name => name.toLowerCase()));
  if (languageNames.has(word.toLowerCase())) {
    return !capitalizedWordExp.test(word);
  }
  return word === word.toUpperCase();
}

export function getFirstTitleBoundaryPosition(title: string): number | null {
  const positions = titleBoundaryParsers
    .map(({ parse }) => parse(title))
    .map(source => (source ? title.indexOf(source) : -1));
  positions.push(
    title.search(sceneReleaseTagExp),
    title.search(releaseTagExp),
    title.search(sourceTagExp),
    title.search(upperCaseSourceTagExp),
  );
  const validPositions = positions.filter(position => position > 0);
  if (validPositions.length === 0) {
    return null;
  }

  // A language word right before the first release tag is the release language, not the title:
  // Snoopy.Presenta.Natale.Con.Snoopy.iTALiAN.MULTi.2160p. Only scene spellings (FRENCH, iTALiAN)
  // count, a capitalized word is the title: Get.Him.To.The.Greek.1080p. Language codes count when
  // upper case, The.Negotiator.HUN.DVDRip, since lower case ones are words (dan, ice, lat).
  const position = Math.min(...validPositions);
  trailingLanguageExp ??= new RegExp(
    String.raw`[-_. ](?<marker>(?:TRUE[-_. ]?)?(?<language>${[
      ...Object.values(Language),
      ...[...getLanguageAliasTokens()].filter(alias => /^[a-z]{3,}$/.test(alias)),
    ].join('|')}))[-_. ]*$`,
    'i',
  );
  const languageMatch = trailingLanguageExp.exec(title.slice(0, position));
  const language = languageMatch?.groups?.language;
  if (languageMatch && language && isReleaseLanguageSpelling(language)) {
    return languageMatch.index > 0 ? languageMatch.index : position;
  }

  return position;
}
