import { removeFileExtension } from './extensions.js';
import { simplifyTitle } from './title/cleanup.js';
import { parseTitleAndYear } from './title/index.js';
import { cleanTorrentSuffixExp, removeWebsitePrefix } from './website.js';

const cleanReleaseGroupExp =
  /(-(RP|1|NZBGeek|Obfuscated|Obfuscation|Scrambled|sample|Pre|postbot|xpost|Rakuv[a-z0-9]*|WhiteRev|BUYMORE|AsRequested|AlternativeToRequested|GEROV|Z0iDS3N|Chamele0n|4P|4Planet|AlteZachen|RePACKPOST))+$/i;
const releaseGroupRegexExp =
  /-(?<releasegroup>[A-Za-zÀ-ÖØ-öø-ÿ0-9]+)(?<!(?:HDTV|SDTV|WEB-(?:DL|Rip)|Blu-Ray|480p|576p|720p|1080p|2160p|DTS-(?:HD|X|MA|ES)|-ES|-EN|-CAT|-ENG|-JAP|-GER|-FRA|-FRE|-ITA|-HDRip|\d{1,2}-bit|[ ._]\d{4}-\d{2}|-\d{2}|tmdb(?:id)?-\d+|tt\d{7,8}|[a-zA-Z]{3}-ENG))(?:\b|[-._ ]|$)/i;
const animeReleaseGroupExp =
  /^\[(?!REQ\])(?<subgroup>[^\s\]\r\n](?:[^\]\r\n]{0,318}[^\s\]\r\n])?)\](?:_|-|\s|\.)?/i;
const exceptionReleaseGroupRegex =
  /(\[)?(?<releasegroup>(Joy|YIFY|YTS.(MX|LT|AG)|AnimePahe|FreetheFish|VH-PROD|FTW-HS|DX-TV|Blu-bits|afm72|Anna|Bandi|Ghost|Kappa|MONOLITH|Qman|RZeroX|SAMPA|Silence|theincognito|D-Z0N3|t3nzin|Vyndros|HDO|DusIctv|DHD|SEV|CtrlHD|-ZR-|ADC|XZVN|RH|Kametsu|r00t|HONE))(\])?$/i;
// Upstream release groups matched anywhere in the title, the last match wins
const exactReleaseGroupExp =
  /\b(?<releasegroup>KRaLiMaRKo|E\.N\.D|D-Z0N3|Koten_Gars|BluDragon|ZØNEHD|HQMUX|VARYG|YIFY|YTS(?:.(?:MX|LT|AG))?|TMd|Eml HDTeam|LMain|DarQ|BEN[_. ]THE[_. ]MEN|TAoE|QxR|126811|Fight-BB|KCRT|Vialle)\b/gi;
// Upstream release groups at the end of a bracketed block, e.g. (... Tigole) or [... Joy]
const bracketedReleaseGroupExp =
  /(?<=[._ [])(?<releasegroup>Silence|afm72|Panda|Ghost|MONOLITH|Tigole|Joy|ImE|UTR|t3nzin|Anime Time|Project Angel|Hakata Ramen|HONE|GiLG|Vyndros|SEV|Garshasp|Kappa|Natty|RCVR|SAMPA|YOGI|r00t|EDGE2020|RZeroX|FreetheFish|Anna|Bandi|Qman|theincognito|HDO|DusIctv|DHD|CtrlHD|-ZR-|ADC|XZVN|RH|Kametsu|Celdra)(?=\]|\))/gi;
// Everything up to an SxxEyy token is the series title, which can contain a group name
const episodeTitlePrefixExp = /^.*?[-._ ]S\d+E\d+[-._ ]/i;
const globalReleaseGroupExp = new RegExp(releaseGroupRegexExp.source, 'ig');
const simpleReleaseGroupSuffixExp = /-(?<releasegroup>[a-z0-9]+)$/i;
const protectedReleaseGroups = new Set(['web-dl', 'web-rip', '480p', '720p', '1080p', '2160p']);
const simpleExceptionReleaseGroups = new Set([
  'joy',
  'yify',
  'animepahe',
  'freethefish',
  'afm72',
  'anna',
  'bandi',
  'ghost',
  'kappa',
  'monolith',
  'qman',
  'rzerox',
  'sampa',
  'silence',
  'theincognito',
  't3nzin',
  'vyndros',
  'hdo',
  'dusictv',
  'dhd',
  'sev',
  'ctrlhd',
  'adc',
  'xzvn',
  'rh',
  'kametsu',
  'r00t',
  'hone',
]);
const dZ0n3ReleaseGroupSuffix = 'd-z0n3';

export function parseGroup(title: string, parsedTitle?: string): string | null {
  const simpleGroup = matchSimpleReleaseGroup(title);
  if (simpleGroup !== null) {
    return simpleGroup;
  }

  const cleanTitle = removeWebsitePrefix(removeFileExtension(title.trim())).replace(
    cleanTorrentSuffixExp,
    '',
  );
  const knownGroup = matchAnimeSubgroup(cleanTitle) ?? matchKnownReleaseGroup(cleanTitle);
  if (knownGroup !== null) {
    return knownGroup;
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

function matchSimpleReleaseGroup(title: string): string | null {
  const titleWithoutExtension = removeFileExtension(title.trim());
  const separatorIndex = titleWithoutExtension.lastIndexOf('-');
  if (separatorIndex === -1 || titleWithoutExtension.lastIndexOf('-', separatorIndex - 1) !== -1) {
    return null;
  }

  const match = simpleReleaseGroupSuffixExp.exec(titleWithoutExtension);
  const group = match?.groups?.releasegroup;
  if (!group) {
    return null;
  }

  const normalizedGroup = group.toLowerCase();
  if (
    protectedReleaseGroups.has(normalizedGroup) ||
    simpleExceptionReleaseGroups.has(normalizedGroup) ||
    titleWithoutExtension.toLowerCase().endsWith(dZ0n3ReleaseGroupSuffix)
  ) {
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

function matchKnownReleaseGroup(title: string): string | null {
  const candidate = stripCleanupSuffixes(title.replace(episodeTitlePrefixExp, ''));
  return (
    lastReleaseGroup(exactReleaseGroupExp, candidate) ??
    lastReleaseGroup(bracketedReleaseGroupExp, candidate)
  );
}

function lastReleaseGroup(exp: RegExp, title: string): string | null {
  let group: string | null = null;
  for (const match of title.matchAll(exp)) {
    group = match.groups?.releasegroup ?? group;
  }

  return group;
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
