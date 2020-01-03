import { parseResolution } from './resolution';
import { parseVideoCodec } from './videoCodec';
import { parseAudioCodec } from './audioCodec';
import { parseAudioChannels } from './audioChannels';
import { simplifyTitle, releaseTitleCleaner } from './simplifyTitle';

const movieTitleRegex = [
  // Special, Despecialized, etc. Edition Movies, e.g: Mission.Impossible.3.Special.Edition.2011
  /^(?<title>(?![([]).+?)?(?:(?:[-_\W](?<![)[!]))*\(?\b(?<edition>(((Extended.|Ultimate.)?(Director.?s|Collector.?s|Theatrical|Ultimate|Final(?=(.(Cut|Edition|Version)))|Extended|Rogue|Special|Despecialized|\d{2,3}(th)?.Anniversary)(.(Cut|Edition|Version))?(.(Extended|Uncensored|Remastered|Unrated|Uncut|IMAX|Fan.?Edit))?|((Uncensored|Remastered|Unrated|Uncut|IMAX|Fan.?Edit|Edition|Restored|((2|3|4)in1))))))\b\)?.{1,3}(?<year>(1(8|9)|20)\d{2}(?!p|i|\d+|\]|\W\d+)))+(\W+|_|$)(?!\\)/i,
  // Normal movie format, e.g: Mission.Impossible.3.2011
  /^(?<title>(?![([]).+?)?(?:(?:[-_\W](?<![)[!]))*(?<year>(1(8|9)|20)\d{2}(?!p|i|(1(8|9)|20)\d{2}|\]|\W(1(8|9)|20)\d{2})))+(\W+|_|$)(?!\\)/i,
  // PassThePopcorn Torrent names: Star.Wars[PassThePopcorn]
  /^(?<title>.+?)?(?:(?:[-_\W](?<![()[!]))*(?<year>(\[\w *\])))+(\W+|_|$)(?!\\)/i,
  // That did not work? Maybe some tool uses [] for years. Who would do that?
  /^(?<title>(?![([]).+?)?(?:(?:[-_\W](?<![)!]))*(?<year>(1(8|9)|20)\d{2}(?!p|i|\d+|\W\d+)))+(\W+|_|$)(?!\\)/i,
  // As a last resort for movies that have ( or [ in their title.
  /^(?<title>.+?)?(?:(?:[-_\W](?<![)[!]))*(?<year>(1(8|9)|20)\d{2}(?!p|i|\d+|\]|\W\d+)))+(\W+|_|$)(?!\\)/i,
];

const reportMovieTitleLenientRegex = /^(?<title>(?![([]).+?)((\W|_))(?:(?<!(19|20)\d{2}.)(German|French|TrueFrench))(.+?)(?=((19|20)\d{2}|$))(?<year>(19|20)\d{2}(?!p|i|\d+|\]|\W\d+))?(\W+|_|$)(?!\\)/i;

export function parseTitleAndYear(
  title: string,
  isLenient = false,
): { title: string; year: string | null } {
  const simpleTitle = simplifyTitle(title);

  const regexes = [...movieTitleRegex];
  if (isLenient) {
    regexes.unshift(reportMovieTitleLenientRegex);
  }

  for (const exp of regexes) {
    const match = exp.exec(simpleTitle);
    if (match?.groups) {
      const result = releaseTitleCleaner(match.groups.title);
      if (result === null) {
        continue;
      }

      const year = match.groups.year || null;

      return { title: result, year };
    }
  }

  // year not found, attack using codec or resolution
  // attempt to parse using the first found artifact like codec
  const resolutionText = parseResolution(title).source;
  const resolutionPosition = title.indexOf(resolutionText ?? '');
  const videoCodecTest = parseVideoCodec(title).source;
  const videoCodecPosition = title.indexOf(videoCodecTest ?? '');
  const channelsTest = parseAudioChannels(title).source;
  const channelsPosition = title.indexOf(channelsTest ?? '');
  const audioCodecTest = parseAudioCodec(title).source;
  const audioCodecPosition = title.indexOf(audioCodecTest ?? '');
  const positions = [
    resolutionPosition,
    audioCodecPosition,
    channelsPosition,
    videoCodecPosition,
  ].filter(x => x > 0);
  if (positions.length) {
    const firstPosition = Math.min(...positions);
    return { title: releaseTitleCleaner(title.slice(0, firstPosition)) ?? '', year: null };
  }

  return { title: title.trim(), year: null };
}
