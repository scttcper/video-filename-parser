import { removeFileExtension } from './extensions.js';
import { simplifyTitle } from './title/cleanup.js';
import { parseTitleAndYear } from './title/index.js';

const websitePrefixExp = /^\[\s*[a-z]+(\.[a-z]+)+\s*\][- ]*|^www\.[a-z]+\.(?:com|net)[ -]*/i;
const cleanReleaseGroupExp =
  /(-(RP|1|NZBGeek|Obfuscated|Obfuscation|Scrambled|sample|Pre|postbot|xpost|Rakuv[a-z0-9]*|WhiteRev|BUYMORE|AsRequested|AlternativeToRequested|GEROV|Z0iDS3N|Chamele0n|4P|4Planet|AlteZachen|RePACKPOST))+$/i;
const releaseGroupRegexExp =
  /-(?<releasegroup>[a-z0-9]+)(?<!WEB-DL|WEB-RIP|480p|720p|1080p|2160p|DTS-(HD|X|MA|ES)|([a-zA-Z]{3}-ENG))(?:\b|[-._ ])/i;
const animeReleaseGroupExp = /^(?:\[(?<subgroup>(?!\s).+?(?<!\s))\](?:_|-|\s|\.)?)/i;
const exceptionReleaseGroupRegex =
  /(\[)?(?<releasegroup>(Joy|YIFY|YTS.(MX|LT|AG)|FreetheFish|VH-PROD|FTW-HS|DX-TV|Blu-bits|afm72|Anna|Bandi|Ghost|Kappa|MONOLITH|Qman|RZeroX|SAMPA|Silence|theincognito|D-Z0N3|t3nzin|Vyndros|HDO|DusIctv|DHD|SEV|CtrlHD|-ZR-|ADC|XZVN|RH|Kametsu|r00t|HONE))(\])?$/i;
const globalReleaseGroupExp = new RegExp(releaseGroupRegexExp.source, 'ig');

export function parseGroup(title: string, parsedTitle?: string): string | null {
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

  trimmed = stripCleanupSuffixes(trimmed);

  return matchGenericReleaseGroup(trimmed);
}

function removeWebsitePrefix(title: string): string {
  return title.replace(websitePrefixExp, '');
}

function normalizeReleaseTitle(title: string, parsedTitle?: string): string {
  return (parsedTitle ?? parseTitleAndYear(title).title).replaceAll(' ', '.');
}

function buildGroupCandidateTitle(title: string, releaseTitle: string): string {
  const trimmed = title
    .replaceAll(' ', '.')
    .replace(releaseTitle === title ? '' : releaseTitle, '')
    .replaceAll('.-.', '.');

  return simplifyTitle(removeFileExtension(trimmed.trim()));
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
  if (animeResult?.groups) {
    return animeResult.groups.subgroup ?? '';
  }

  return null;
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
