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

const websitePrefixRegex = /^\[\s*[a-z]+(\.[a-z]+)+\s*\][- ]*|^www\.[a-z]+\.(?:com|net)[ -]*/i;
const cleanTorrentSuffixRegex = /\[(?:ettv|rartv|rarbg|cttv)\]$/i;

const simpleTitleRegex = /\s*(?:480[ip]|576[ip]|720[ip]|1080[ip]|2160[ip]|[xh][\W_]?26[45]|DD\W?5\W1|[<>?*:|]|848x480|1280x720|1920x1080|(8|10)b(it)?)/i;
const simpleReplaceTitle = /\s*(?:[<>?*:|])/i;

const requestInfoRegex = /\[.+?\]/i;
const reportMovieTitleLenientRegex = /^(?<title>(?![([]).+?)((\W|_))(?:(?<!(19|20)\d{2}.)(German|French|TrueFrench))(.+?)(?=((19|20)\d{2}|$))(?<year>(19|20)\d{2}(?!p|i|\d+|\]|\W\d+))?(\W+|_|$)(?!\\)/i;

export function parseTitleAndYear(title: string, isLenient = false): { title: string; year: string | null } {
  let simpleTitle = title.replace(simpleTitleRegex, '');
  simpleTitle = simpleTitle.replace(websitePrefixRegex, '');
  simpleTitle = simpleTitle.replace(cleanTorrentSuffixRegex, '');

  const regexes = [...movieTitleRegex];
  if (isLenient) {
    regexes.unshift(reportMovieTitleLenientRegex);
  }

  for (const exp of regexes) {
    const match = exp.exec(simpleTitle);
    if (match && match.groups) {
      const result = parseMovieMatchCollection(match.groups.title);
      if (result === null) {
        continue;
      }

      const year = match.groups.year || null;

      return { title: result, year };
    }
  }

  return { title: title.trim(), year: null };
}

export function parseMovieMatchCollection(title: string) {
  if (title.length === 0 || title === '(') {
    return null;
  }

  let movieName = title.replace('_', ' ');
  movieName = movieName.replace(requestInfoRegex, '').trim();

  const parts = movieName.split('.');
  let result = '';
  let n = 0;
  let previousAcronym = false;
  let nextPart = '';
  for (const part of parts) {
    if (parts.length >= n + 2) {
      nextPart = parts[n + 1];
    }

    if (part.length === 1 && part.toLowerCase() !== 'a' && Number.isNaN(parseInt(part, 10))) {
      result += part + '.';
      previousAcronym = true;
    } else if (part.toLowerCase() === 'a' && (previousAcronym === true || nextPart.length === 1)) {
      result += part + '.';
      previousAcronym = true;
    } else {
      if (previousAcronym) {
        result += ' ';
        previousAcronym = false;
      }

      result += part + ' ';
    }

    n++;
  }

  return result.trim();
}
