import { removeFileExtension } from './extensions';

const websitePrefixExp = /^\[\s*[a-z]+(\.[a-z]+)+\s*\][- ]*|^www\.[a-z]+\.(?:com|net)[ -]*/i;
const cleanReleaseGroupExp = /^(.*?[-._ ](S\d+E\d+)[-._ ])|(-(RP|1|NZBGeek|Obfuscated|sample|Pre|postbot|xpost))+$/i;
const releaseGroupRegexExp = /-(?<releasegroup>[a-z0-9]+)(?<!WEB-DL|480p|720p|1080p|2160p)(?:\b|[-._ ])/i;
const animeReleaseGroupExp = /^(?:\[(?<subgroup>(?!\s).+?(?<!\s))\](?:_|-|\s|\.)?)/i;

export function parseGroup(title: string) {
  let trimmed = removeFileExtension(title.trim());
  trimmed = trimmed.replace(websitePrefixExp, '');

  const animeResult = animeReleaseGroupExp.exec(trimmed);
  if (animeResult && animeResult.groups) {
    return animeResult.groups.subgroup;
  }

  trimmed = trimmed.replace(cleanReleaseGroupExp, '');

  const globalReleaseGroupExp = new RegExp(releaseGroupRegexExp.source, 'ig');
  let result;
  while ((result = globalReleaseGroupExp.exec(trimmed))) {
    if (!result || !result.groups) {
      continue;
    }

    const group = result.groups.releasegroup;

    if (!Number.isNaN(Number(group))) {
      return null;
    }

    return group;
  }

  return null;
}
