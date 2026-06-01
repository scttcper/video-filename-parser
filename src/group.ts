import { removeFileExtension } from './extensions.js';
import { simplifyTitle } from './title/cleanup.js';
import { parseTitleAndYear } from './title/index.js';
import { cleanTorrentSuffixExp, websitePrefixExp } from './website.js';

const cleanReleaseGroupExp =
  /(-(RP|1|NZBGeek|Obfuscated|Obfuscation|Scrambled|sample|Pre|postbot|xpost|Rakuv[a-z0-9]*|WhiteRev|BUYMORE|AsRequested|AlternativeToRequested|GEROV|Z0iDS3N|Chamele0n|4P|4Planet|AlteZachen|RePACKPOST))+$/i;
const releaseGroupRegexExp =
  /-(?<releasegroup>[a-z0-9]+)(?<!WEB-DL|WEB-RIP|480p|720p|1080p|2160p|DTS-(HD|X|MA|ES)|([a-zA-Z]{3}-ENG))(?:\b|[-._ ])/i;
const animeReleaseGroupExp =
  /^\[(?<subgroup>[^\s\]\r\n](?:[^\]\r\n]{0,318}[^\s\]\r\n])?)\](?:_|-|\s|\.)?/i;
const exceptionReleaseGroupRegex =
  /(\[)?(?<releasegroup>(Joy|YIFY|YTS.(MX|LT|AG)|FreetheFish|VH-PROD|FTW-HS|DX-TV|Blu-bits|afm72|Anna|Bandi|Ghost|Kappa|MONOLITH|Qman|RZeroX|SAMPA|Silence|theincognito|D-Z0N3|t3nzin|Vyndros|HDO|DusIctv|DHD|SEV|CtrlHD|-ZR-|ADC|XZVN|RH|Kametsu|r00t|HONE))(\])?$/i;
const globalReleaseGroupExp = new RegExp(releaseGroupRegexExp.source, 'ig');
const simpleReleaseGroupSuffixExp = /-(?<releasegroup>[a-z0-9]+)$/i;
const protectedReleaseGroups = new Set(['web-dl', 'web-rip', '480p', '720p', '1080p', '2160p']);
const exceptionReleaseGroupSuffixExp =
  /(?:Joy|YIFY|YTS.(?:MX|LT|AG)|FreetheFish|VH-PROD|FTW-HS|DX-TV|Blu-bits|afm72|Anna|Bandi|Ghost|Kappa|MONOLITH|Qman|RZeroX|SAMPA|Silence|theincognito|D-Z0N3|t3nzin|Vyndros|HDO|DusIctv|DHD|SEV|CtrlHD|-ZR-|ADC|XZVN|RH|Kametsu|r00t|HONE)$/i;

export function parseGroup(title: string, parsedTitle?: string): string | null {
  const simpleGroup = matchSimpleReleaseGroup(title);
  if (simpleGroup !== null) {
    return simpleGroup;
  }

  const nowebsiteTitle = removeWebsitePrefix(title);
  const releaseTitle = normalizeReleaseTitle(nowebsiteTitle, parsedTitle);
  let trimmed = buildGroupCandidateTitle(nowebsiteTitle, releaseTitle);

  if (trimmed.length === 0) {
    return null;
  }

  const exceptionGroup = matchExceptionReleaseGroup(trimmed);
  if (exceptionGroup !== null) {
    return exceptionGroup;
  }

  const animeSubgroup = matchAnimeSubgroup(trimmed);
  if (animeSubgroup !== null) {
    return animeSubgroup;
  }

  trimmed = simplifyTitle(trimmed);
  trimmed = stripCleanupSuffixes(trimmed);

  return matchGenericReleaseGroup(trimmed);
}

function removeWebsitePrefix(title: string): string {
  return title.replace(websitePrefixExp, '');
}

function matchSimpleReleaseGroup(title: string): string | null {
  const titleWithoutExtension = removeFileExtension(title.trim());
  const separatorIndex = titleWithoutExtension.lastIndexOf('-');
  if (separatorIndex === -1 || titleWithoutExtension.lastIndexOf('-', separatorIndex - 1) !== -1) {
    return null;
  }

  if (exceptionReleaseGroupSuffixExp.test(titleWithoutExtension)) {
    return null;
  }

  const match = simpleReleaseGroupSuffixExp.exec(titleWithoutExtension);
  const group = match?.groups?.releasegroup;
  if (!group) {
    return null;
  }

  if (protectedReleaseGroups.has(group.toLowerCase())) {
    return null;
  }

  return group;
}

function normalizeReleaseTitle(title: string, parsedTitle?: string): string {
  return (parsedTitle ?? parseTitleAndYear(title).title).replaceAll(' ', '.');
}

function buildGroupCandidateTitle(title: string, releaseTitle: string): string {
  const trimmed = title
    .replaceAll(' ', '.')
    .replace(releaseTitle === title ? '' : releaseTitle, '')
    .replaceAll('.-.', '.')
    .replace(cleanTorrentSuffixExp, '');

  return removeFileExtension(trimmed.trim());
}

function matchExceptionReleaseGroup(title: string): string | null {
  const exceptionResult = exceptionReleaseGroupRegex.exec(title);
  if (exceptionResult?.groups?.releasegroup) {
    return exceptionResult.groups.releasegroup;
  }

  return null;
}

function matchAnimeSubgroup(title: string): string | null {
  const animeResult = animeReleaseGroupExp.exec(title);
  return animeResult?.groups?.subgroup ?? null;
}

function stripCleanupSuffixes(title: string): string {
  return title.replace(cleanReleaseGroupExp, '');
}

function matchGenericReleaseGroup(title: string): string | null {
  globalReleaseGroupExp.lastIndex = 0;

  for (const result of title.matchAll(globalReleaseGroupExp)) {
    if (!result?.groups) {
      continue;
    }

    const group = result.groups.releasegroup ?? '';

    return group;
  }

  return null;
}
