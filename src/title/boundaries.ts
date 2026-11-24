import { parseAudioChannels } from '../audioChannels.js';
import { parseAudioCodec } from '../audioCodec.js';
import { getLanguageAliasTokens, Language } from '../language.js';
import { findFirstResolutionToken } from '../resolution.js';
import { parseVideoCodec } from '../videoCodec.js';

import { articleOnlyExp } from './cleanup.js';

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

// Scene tags that end a title with no year, or an episode title. Case-sensitive so title words
// like "The Complete Guide" or "Get Real" don't end the title, scene names spell these upper case
// or iNTERNAL style.
export const sceneReleaseTagExp: RegExp =
  /[-_. ](?:MULTi|MULTI|DUAL|HDR|HDR10|HDR10Plus|DV|HLG|COMPLETE|PROPER|REAL|REPACK|RERIP|READ[-_. ]NFO|iNTERNAL|INTERNAL|DiRFiX|DIRFIX|NFOFiX|NFOFIX|SUBBED|ANiME|ANIME|D\d{2,3})(?=[-_. ]|$)/;
// The tags below need a dot, underscore or space before them. Joined by a hyphen they are part of
// the name (Boys.Dont.Cry-WS-DVDRiP-SPHiSO) and the group parser needs them. No DL, it would split
// a dotted WEB.DL and leave WEB in the title.
const releaseTagExp =
  /[._ ](?:DUBBED|WS|FS|UNCUT|UNRATED|STV|LD|XXX|DOC|DOCU|DOKU|READNFO|[A-Za-z]{2,7}SUB(?:S|BED)?)(?=[-_. ]|$)/;
// Also a title word, only a tag once the name has lower case: THE.DARJEELING.LIMITED.1080p
const limitedTagExp = /[._ ]LIMITED(?=[-_. ]|$)/g;
// Sources aren't title words, so any case. Gota.Kanal.3.Bakom.Kulisserna.SWEDiSH.PDTV.XViD. A
// dotted DVD.SCREENER or WEB.SCREENER is one tag, so DVD or WEB doesn't stay in the title. Cam is
// a word (Court Cam) but right in front of the codec it is the source: Movie.Title.cam.XviD
const sourceTagExp =
  /[._ ](?:PDTV|[SH]D[._ ]?TV|HDTVRip|DSR|DSRip|TVRip|SATRip|DVBRip|DVB|DTVRip|DTV|DVTV|VHSRip|DVDRip|DVDR|DVD[59]|DVDSCR|(?:(?:DVD|WEB)[._ ]?)?SCREENER|SVCD|VCD|BDRip|BRRip|HDRip|CAM(?=[._ ](?:XviD|DivX|[xh][._ ]?26[45]|HEVC|AVC)(?:[-_. ]|$)))(?=[-_. ]|$)/gi;
// Short source tags that are also words (My.Pal.Joey, a web cam), only upper case
export const upperCaseSourceTagExp: RegExp =
  /[._ ](?:PAL|NTSC|SECAM|TS|TC|CAM|R5|SCREENER)(?=[-_. ]|$)/;
const sceneReleaseTagGlobalExp = new RegExp(sceneReleaseTagExp.source, 'g');
const releaseTagGlobalExp = new RegExp(releaseTagExp.source, 'g');
const upperCaseSourceTagGlobalExp = new RegExp(upperCaseSourceTagExp.source, 'g');
const lowerCaseLetterExp = /\p{Ll}/u;

// The first match with a lower case letter somewhere before it
function searchAfterLowerCase(title: string, exp: RegExp): number {
  for (const match of title.matchAll(exp)) {
    if (lowerCaseLetterExp.test(title.slice(0, match.index))) {
      return match.index;
    }
  }
  return -1;
}

// Built on first use, language.ts imports the title parser so Language isn't set at load time
let trailingLanguageExp: RegExp | undefined;
const capitalizedWordExp = /^\p{Lu}\p{Ll}+$/u;
let languageNames: ReadonlySet<string> | undefined;

function isReleaseLanguageSpelling(word: string, titleBefore: string): boolean {
  languageNames ??= new Set(Object.values(Language).map(name => name.toLowerCase()));
  if (languageNames.has(word.toLowerCase())) {
    return !capitalizedWordExp.test(word);
  }
  // Upper case codes are words in an upper case name too, FIRE.AND.ICE.1080p
  return word === word.toUpperCase() && lowerCaseLetterExp.test(titleBefore);
}

// A tag never leaves a lone article as the title: The Screener, The.4K
function isTitleBefore(title: string, position: number): boolean {
  return position > 0 && !articleOnlyExp.test(title.slice(0, position));
}

// The first match that leaves a title in front of it, The.Screener.Gets.Away.PDTV ends at PDTV
function searchTag(title: string, globalExp: RegExp): number {
  for (const match of title.matchAll(globalExp)) {
    if (isTitleBefore(title, match.index)) {
      return match.index;
    }
  }
  return -1;
}

export function getFirstTitleBoundaryPosition(title: string): number | null {
  const positions = titleBoundaryParsers
    .map(({ parse }) => parse(title))
    .map(source => (source ? title.indexOf(source) : -1));
  positions.push(
    searchTag(title, sceneReleaseTagGlobalExp),
    searchTag(title, releaseTagGlobalExp),
    searchTag(title, sourceTagExp),
    searchTag(title, upperCaseSourceTagGlobalExp),
    searchAfterLowerCase(title, limitedTagExp),
  );
  const validPositions = positions.filter(position => isTitleBefore(title, position));
  if (validPositions.length === 0) {
    return null;
  }

  // A language word right before the first release tag is the release language, not the title:
  // Snoopy.Presenta.Natale.Con.Snoopy.iTALiAN.MULTi.2160p. Only scene spellings (FRENCH, iTALiAN)
  // count, a capitalized word is the title: Get.Him.To.The.Greek.1080p. Language codes count when
  // upper case, The.Negotiator.HUN.ENG.DVDRip, since lower case ones are words (dan, ice, lat).
  let position = Math.min(...validPositions);
  trailingLanguageExp ??= new RegExp(
    String.raw`[-_. ](?<marker>(?:TRUE[-_. ]?)?(?<language>${[
      ...Object.values(Language),
      ...[...getLanguageAliasTokens()].filter(alias => /^[a-z]{3,}$/.test(alias)),
    ].join('|')}))[-_. ]*$`,
    'i',
  );
  // Stacked tags like HUN.ENG come off one at a time, a few at most so long names stay fast
  for (let stripped = 0; stripped < 4; stripped++) {
    const languageMatch = trailingLanguageExp.exec(title.slice(0, position));
    const language = languageMatch?.groups?.language;
    if (
      !languageMatch ||
      !language ||
      languageMatch.index === 0 ||
      !isReleaseLanguageSpelling(language, title.slice(0, languageMatch.index))
    ) {
      break;
    }
    position = languageMatch.index;
  }

  return position;
}
