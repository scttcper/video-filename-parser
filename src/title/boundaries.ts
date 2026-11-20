import { parseAudioChannels } from '../audioChannels.js';
import { parseAudioCodec } from '../audioCodec.js';
import { Language } from '../language.js';
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

// Built on first use, language.ts imports the title parser so Language isn't set at load time
let trailingLanguageExp: RegExp | undefined;

export function getFirstTitleBoundaryPosition(title: string): number | null {
  const positions = titleBoundaryParsers
    .map(({ parse }) => parse(title))
    .map(source => (source ? title.indexOf(source) : -1));
  positions.push(title.search(sceneReleaseTagExp));
  const validPositions = positions.filter(position => position > 0);
  if (validPositions.length === 0) {
    return null;
  }

  // A language word right before the first release tag is the release language, not the title:
  // Snoopy.Presenta.Natale.Con.Snoopy.iTALiAN.MULTi.2160p
  const position = Math.min(...validPositions);
  trailingLanguageExp ??= new RegExp(
    String.raw`[-_. ](?:${Object.values(Language).join('|')})[-_. ]*$`,
    'i',
  );
  const languageIndex = title.slice(0, position).search(trailingLanguageExp);
  return languageIndex > 0 ? languageIndex : position;
}
