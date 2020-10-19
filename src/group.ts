import { removeFileExtension } from './extensions';
import { parseTitleAndYear } from './title';

const websitePrefixExp = /^\[\s*[a-z]+(\.[a-z]+)+\s*\][- ]*|^www\.[a-z]+\.(?:com|net)[ -]*/i;
const cleanReleaseGroupExp = /^(.*?[-._ ](S\d+E\d+)[-._ ])|(-(RP|1|NZBGeek|Obfuscated|sample|Pre|postbot|xpost|Rakuv[a-z0-9]*|WhiteRev|BUYMORE|AsRequested|AlternativeToRequested|GEROV|Z0iDS3N|Chamele0n|4P|4Planet))+$/i;
const releaseGroupRegexExp = /-(?<releasegroup>[a-z0-9]+)(?<!WEB-DL|480p|720p|1080p|2160p|DTS-HD|DTS-X)(?:\b|[-._ ])/i;
const animeReleaseGroupExp = /^(?:\[(?<subgroup>(?!\s).+?(?<!\s))\](?:_|-|\s|\.)?)/i;

export function parseGroup(title: string): string | null {
  const nowebsiteTitle = title.replace(websitePrefixExp, '');
  let { title: releaseTitle } = parseTitleAndYear(nowebsiteTitle);
  releaseTitle = releaseTitle.replace(/ /g, '.');
  let trimmed = nowebsiteTitle.replace(/ /g, '.').replace(releaseTitle, '');
  trimmed = removeFileExtension(trimmed.trim());

  if (trimmed.length === 0) {
    return null;
  }

  const animeResult = animeReleaseGroupExp.exec(trimmed);
  if (animeResult?.groups) {
    return animeResult.groups.subgroup;
  }

  trimmed = trimmed.replace(cleanReleaseGroupExp, '');

  const globalReleaseGroupExp = new RegExp(releaseGroupRegexExp.source, 'ig');
  let result;
  while ((result = globalReleaseGroupExp.exec(trimmed))) {
    if (!result || !result.groups) {
      continue;
    }

    const group = result.groups.releasegroup as string;

    if (!Number.isNaN(Number(group))) {
      return null;
    }

    return group;
  }

  return null;
}
